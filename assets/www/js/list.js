/***
 * scroll list.
 * 
 * **/

(function(){
    
    "use strict";
    
    var loadProgress = document.getElementById('loadingStatus')
      , pullUpEl
      , pullUpOffset;
    
    var myScroll
      , store = window.localStorage
      , app = null
      , lists = document.getElementById('bookList')
      , listLength = document.getElementById('listLength')
      , listWrapper = document.getElementById('wrapper')
      , listScroller = document.getElementById('scroller')
      , pageContent = document.getElementById('pageContent')
      , pageHeader = document.getElementById('pageHeader')
      , navLinks = document.querySelectorAll('.nav_detail')
      , key = store.getItem('key') || 'node'
      , rkey = store.getItem('cache_key')
      , match = store.getItem('match') || 'qx'
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
      , hasReadPosition = 0;
    
    // judge this query is or isn't a re-do query.
    if(key === rkey && match === rmatch){
        reQuery = true;
    }
    
    var pageState = {
        loading: function(){}
      , success: function(response){
            // when book query return success.
            // the init page.
            var result = null
              , flag = true;
            
            try {
                result = JSON.parse(response);
                
                //if it's not query the same params.
                if(!reQuery){
                    store.setItem('cache_key', key);
                    store.setItem('cache_match', match);
                    store.setItem('cache_result', response);
                }
            }
            catch(err){
                flag = false;
                console.log("JSON parse: " + err);
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
                  aItem.setAttribute('href', 'bookdetail.html?id=' + tempArr[i].index);
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
                callError('result');
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
      
        if(app && app.network){
            var netStat = app.network()
              , info = '';
            if(!netStat){
              info = '网络错误，请检查网络连接。'
              callError(info);
              return;
            }
        }
      
        var xhr = new XMLHttpRequest()
          , url = 'http://star.dmdgeeker.com/search?key=' + encodeURIComponent(key) + '&match=' + match;
        
        xhr.onreadystatechange = function(){
            var response = null;
            if(xhr.readyState === 4){
                if((xhr.status >= 200 && xhr.status < 300)|| xhr.status === 304){
                    response = xhr.responseText;
                    pageState.success(response);
                }
                else {
                    var serverError = '服务器错误:' + xhr.status;
                    callError(serverError);
                }
            }
            else {
                pageState.loading();
            }
        };
        
        xhr.onprogress = function(evt){
            if(evt.lengthComputable){
                //loadProgress.innerText = Math.round(100*evt.loaded/evt.total) + '%';
            }
        };
        
        xhr.timeout = 70000;
        xhr.ontimeout = function(){
            xhr.abort();
        };
        console.log(url);
        xhr.open('GET', url);
        xhr.send(null);
    }
    
    /***
     * when get list error;
     * **/
    function callError(info){
        info = info.toString();
        APP.displayError(info);
    }
    
    function scrollRefresh(){
        if (pullUpEl.className.match('loading')) {
          pullUpEl.className = '';
          pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
        }
    }
    
    function scrollMove(){
        
        if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
          pullUpEl.className = 'flip';
          pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
          this.maxScrollY = this.maxScrollY;
        } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
          pullUpEl.className = '';
          pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
          this.maxScrollY = pullUpOffset;
        }
    }
    
    function scrollEnd(){
        if(pullUpEl.className.match('flip')) {
          pullUpEl.className = 'loading';
          pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';        
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
      
      for(var i = 0, len = tArr.length; i < len; i++){
        var liItem = document.createElement('li')
          , aItem = document.createElement('a');
        
        liItem.className = 'book_item';
        aItem.innerText = '' + tArr[i].title;
        aItem.setAttribute('title', tArr[i].index);
        aItem.setAttribute('href', 'bookdetail.html?id=' + tArr[i].index);
        aItem.className = 'nav_detail';
        aItem.addEventListener('click', navClicked, false);
        liItem.appendChild(aItem);
        lists.appendChild(liItem);
      }
      
      setTimeout(function(){
        myScroll.refresh();
      }, 0);
    }
    /**
     * document is ready;
     * **/
    function appready(){
        
        if(window.APP){
            app = window.APP;
        }
        
        loaded();
        
        if(!reQuery){
            sendQuery();
        }
        else {
            var res = store.getItem('cache_result');
            pageState.success(res);
        }
    }
    
    function loaded(){
        
        var size = app ? app.getMineSize : pageState.getSize
          , sh = screen.height
          , wsY = window.screenY
          , headerH = size(pageHeader).height
          , contentH = sh - headerH - wsY;
        
        pullUpEl = document.getElementById('pullUp');
        pullUpOffset = pullUpEl.offsetHeight;
        
        pageContent.style.height = contentH + 'px';
        listWrapper.style.top = headerH + 'px';
        listWrapper.style.height = contentH + 'px';
        
        // init scroll view;
        myScroll = new iScroll('wrapper', scrollOptions);
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
    
    document.addEventListener('deviceready', appready, false);
    
})();






