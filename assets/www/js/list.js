/***
 * scroll list.
 * 
 * **/

(function(){
    
    "use strict";
    
    var loadProgress = document.getElementById('loadingStatus');
    
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
      , booksList = [];
    
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
                    tempArr = records;
                    booksList = records;
                    if(len > 50) tempArr.length = 50;
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
                serverError('result');
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
     * init scroll view;
     * 
     * **/
    function scrollInit(){
        myScroll = new iScroll('wrapper', scrollOptions);
    }
    
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
        
    }
    
    function scrollMove(){
        
    }
    
    function scrollEnd(){
        
    }
    
    function pullUpAction(){
            
            
            
          myScroll.refresh();
            
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
            // console.log('re query');
            pageState.success(res);
        }
        
    }
    
    function loaded(){
        
        var size = app ? app.getMineSize : pageState.getSize
          , sh = screen.height
          , wsY = window.screenY
          , headerH = size(pageHeader).height
          , contentH = sh - headerH - wsY;
        
        pageContent.style.height = contentH + 'px';
        listWrapper.style.top = headerH + 'px';
        listWrapper.style.height = contentH + 'px';
        
        scrollInit();
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






