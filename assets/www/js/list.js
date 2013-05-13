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
      , reQuery = false;
    
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
                    if(len > 50) tempArr.length = 50;
                }
                
                for(var i = 0; i < tempArr.length; i++){
                    listContent += '<li class="book_item"><a href="bookdetail.html">' + tempArr[i].title + '</a></li>'
                }
                
                lists.innerHTML = listContent;
                
                myScroll.refresh();
                
                listLength.innerText = len;
                
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
        //myScroll = new iScroll('wrapper');
        //myScroll.refresh();
    }
    
    /**
     * when app is ready
     * **/
    function sendQuery(){
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
                    var info = 'ajax:' + xhr.status;
                    serverError(info);
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
        
        xhr.timeout = 100000;
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
    function serverError(info){
        info = info || '';
        console.log("something goes wrong! " + info);
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
        
        // check network;
        if(app && app.network){
            console.log('network: ' + app.network());
        }
        
        if(!reQuery){
            sendQuery();
        }
        else {
            var res = store.getItem('cache_result');
            console.log('re query');
            pageState.success(res);
        }
        
    }
    
    function loaded(){
        
        var size = app ? app.getMineSize : pageState.getSize
          , sh = screen.height
          , wsY = window.screenY
          , headerH = size(pageHeader).height
          , contentH = sh - headerH - wsY;
        
        console.log('sh:' + sh + '--ssY:' + wsY);
        
        pageContent.style.height = contentH + 'px';
        listWrapper.style.top = headerH + 'px';
        listWrapper.style.height = contentH + 'px';
        
        scrollInit();
    }
    
    document.addEventListener('touchmove',function(e){
        e.preventDefault();
    }, false);
    
    document.addEventListener('deviceready', appready, false);
    
})();






