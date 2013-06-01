/***
 * scroll list.
 * 
 * **/

(function(){
    
    var loadProgress = document.getElementById('loadingStatus')
      , pullUpEl
      , pullUpOffset;
    
    var myScroll
      , store = window.localStorage
      , context = {
        // this context
        type:'qx'  // default is query the keyword.
        , key: store.getItem('key')
        , match: store.getItem('match')
      }
      , search = location.search
      , lists = document.getElementById('bookList')
      , listLength = document.getElementById('listLength')
      , listWrapper = document.getElementById('wrapper')
      , listScroller = document.getElementById('scroller')
      , pageContent = document.getElementById('pageContent')
      , pageHeader = document.getElementById('pageHeader')
      , navLinks = document.querySelectorAll('.nav_detail')
      , key = store.getItem('key')
      , rkey = store.getItem('cache_key')
      , match = store.getItem('match')
      , rmatch = store.getItem('cache_match')
      , scrollOptions = {
          onRefresh: scrollRefresh
        , useTransition: false
        , bounce: true
        , onScrollMove: scrollMove
        , onScrollEnd: scrollEnd
      }
      , reQuery = false
      , booksList = []
      , hasReadPosition = 0
      , type;
    
    // judge this query is or isn't a re-do query.
    if(key === rkey && match === rmatch){
        reQuery = true;
    }
    
    var pageState = {
        loading: function(){
          console.log('page loading!');
        }
      , success: function(response, favor){
            // when book query return success.
            // the init page.
            var result = null
              , flag = true;
            
            if(favor){
              // if it comes from favor
              var _res = {}
                , _r = response
                , _len = response.length
                ;
              type = 'favor';
              result = {};
              result.res = [];
              result.length = _len;
              
              for(var i = 0; i < _len; i++){
                result.res.push(JSON.parse(_r.item(i).data));
              }
            }
            else {
              type = 'query';
              try {
                result = JSON.parse(response);
                //if it's not query the same params.
                if(!reQuery){
                    store.setItem('cache_key', key);
                    store.setItem('cache_match', match);
                    store.setItem('cache_result', JSON.stringify(result));
                }
              }
              catch(err){
                  flag = false;
                  console.log("JSON parse: " + err);
              }
            }
            
            if(flag && result){
                var len = result.length
                  , records = result.res
                  , tempArr = []
                  , listContent = '';
                
                if(Array.isArray(records)){
                    booksList = records;
                    if(len > 50){
                      tempArr = records.slice(0, 50);
                      hasReadPosition = 50;
                    }
                    else {
                      pullUpEl.style.display = 'none';
                      tempArr = records;
                    }
                }
                
                for(var i = 0; i < tempArr.length; i++){
                  
                  var liItem = document.createElement('li')
                    , aItem = document.createElement('a');
                  
                  liItem.className = 'book_item';
                  aItem.innerText = '' + tempArr[i].title;
                  aItem.setAttribute('title', tempArr[i].index);
                  aItem.setAttribute('href', 'bookdetail.html?id=' + tempArr[i].index + '&type=' + type);
                  aItem.className = 'nav_detail';
                  aItem.addEventListener('click', navClicked, false);
                  liItem.appendChild(aItem);
                  lists.appendChild(liItem);
                }
                
                //lists.innerHTML = listContent;
                listLength.innerText = len;
                APP.displayContent('pageContent');
                
                setTimeout(function(){
                  myScroll.refresh();
                }, 0);
                
            }
            else {
                callError('对不起，应用出错了...');
            }
        }
      , getSize: function(e){
            var box = e.getBoundingClientRect();
            var w = box.width || (box.right - box.left);
            var h = box.height || (box.bottom - box.top);
            return {width:w, height:h};
        }
    };
    
    /**
     * when app is ready
     * **/
    function sendQuery(){
      
        if(APP && APP.network){
            var netStat = APP.network()
              , info = '';
            if(!netStat){
              info = '网络错误，请检查网络连接。'
              callError(info);
              return;
            }
        }
      
        var xhr = new XMLHttpRequest()
          , url = 'http://bistulib.dmdgeeker.com/search?key=' + context.key + '&match=' + context.match;
        
        xhr.onreadystatechange = function(){
            var response = null;
            if(xhr.readyState === 4){
                if((xhr.status >= 200 && xhr.status < 300)|| xhr.status === 304){
                    response = xhr.responseText;
                    pageState.success(response);
                }
                else {
                    var serverError = '服务器出错了:' + xhr.status;
                    callError(serverError);
                }
            }
            else {
                // pageState.loading();
            }
        };
        
        xhr.onprogress = function(evt){
            if(evt.lengthComputable){
                //loadProgress.innerText = Math.round(100*evt.loaded/evt.total) + '%';
            }
        };
        
        xhr.timeout = 70000;
        xhr.ontimeout = function(){
            var timeoutError = '加载超时，请检查网络连接。';
            callError(timeoutError);
            xhr.abort();
        };
        
        xhr.open('GET', url);
        xhr.send(null);
    }
    
    /***
     * when get list error;
     * **/
    function callError(info){
        APP.displayError(info);
    }
    
    function scrollRefresh(){
        if (pullUpEl.className.match('loading')) {
          pullUpEl.className = '';
          pullUpEl.querySelector('.pullUpLabel').innerHTML = '向上拉加载更多...';
        }
    }
    
    function scrollMove(){
        
        if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
          pullUpEl.className = 'flip';
          pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开即加载更多...';
          this.maxScrollY = this.maxScrollY;
        } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
          pullUpEl.className = '';
          pullUpEl.querySelector('.pullUpLabel').innerHTML = '向上拉加载更多...';
          this.maxScrollY = pullUpOffset;
        }
    }
    
    function scrollEnd(){
        if(pullUpEl.className.match('flip')) {
          pullUpEl.className = 'loading';
          pullUpEl.querySelector('.pullUpLabel').innerHTML = '正在加载中...';        
          pullUpAction();
        }
    }
    
    function pullUpAction(){
      
      var tArr = []
        , end = 0;
      
      if(hasReadPosition === 0 || hasReadPosition < 50){
        return;
      }
      else {
        
        if((booksList.length - hasReadPosition) > 50){
          end = hasReadPosition + 50;
        }
        else {
          end = booksList.length;
        }
        
        tArr = booksList.slice(hasReadPosition, end);
        hasReadPosition += tArr.length;
      }
      
      if(type === undefined){
        type = 'favor';
      }
      
      for(var i = 0, len = tArr.length; i < len; i++){
        var liItem = document.createElement('li')
          , aItem = document.createElement('a');
        
        liItem.className = 'book_item';
        aItem.innerText = '' + tArr[i].title;
        aItem.setAttribute('title', tArr[i].index);
        aItem.setAttribute('href', 'bookdetail.html?id=' + tArr[i].index + '&type=' + type);
        aItem.className = 'nav_detail';
        aItem.addEventListener('click', navClicked, false);
        liItem.appendChild(aItem);
        lists.appendChild(liItem);
      }
      
      setTimeout(function(){
        myScroll.refresh();
      }, 0);
    }
    
    function appReady(){
        
        var size = APP ? APP.getMineSize : pageState.getSize
          , sh = screen.height
          , wsY = window.screenY
          , headerH = size(pageHeader).height
          , contentH = sh - headerH - wsY
          , queries = null;
        
        pullUpEl = document.getElementById('pullUp');
        pullUpOffset = pullUpEl.offsetHeight;
        
        pageContent.style.height = contentH + 'px';
        listWrapper.style.top = headerH + 'px';
        listWrapper.style.height = contentH + 'px';
        
        queries = APP.handleParams(search);
        
        if(queries){
          if(queries.type){
            context.type = queries.type;
          }
          if(queries.key){
            context.key = queries.key;
          }
          if(queries.match){
            context.match = queries.match;
          }
        }
        
        if(context.type === 'favor'){
          // do check favor
          favorQuery();
        }
        else{
          if(!reQuery){
            sendQuery();
          }
          else {
            var res = store.getItem('cache_result');
            pageState.success(res);
          }
        }
        
        // init scroll view;
        myScroll = new iScroll('wrapper', scrollOptions);
    }
    
    function favorQuery(){
      var db = null;
      if(APP.database){
        db = APP.database;
      }
      else {
        db = window.openDatabase("bistudb", "1.0", "Bistu library DB", 200000);
      }
      
      db.transaction(function(tx){
        tx.executeSql('SELECT * FROM favor', [], function(tx, results){
          var r = results.rows
            , len = r.length;
          if(len < 1){
            // no favors
            var nofavor = '您还没有收藏任何书目。';
            pullUpEl.style.display = 'none';
            callError(nofavor);
          }
          else {
            // has favors
            // var hasfavor = '已有' + len + '本书。';
            // console.log('has: ' + hasfavor);
            pageState.success(r, true);
            APP.displayContent('pageContent');
          }
        }, function(tx, err){
          console.log('verify select error.');
        });
      }, function(err){
        console.log('verify error.');
      }, function(){
        // console.log('verify success.');
      });
    }
    
    function navClicked(){
        var title = this.getAttribute('title') || 'title'
          , name = this.innerText;
        
        store.setItem('bookId', title);
        store.setItem('bookName', name);
    }
    
    document.addEventListener('touchmove',function(e){
        e.preventDefault();
    }, false);
    
    document.addEventListener('deviceready', appReady, false);
    
})();






