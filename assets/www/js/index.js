/***
 * index page.
 * 
 * **/
(function(){
    
    var setBtn = document.getElementById('settings')
      , page = document.getElementById('app')
      , queryNumber = document.getElementById('queryNumber')
      , queryMatch = document.getElementById('queryMatch')
      , sendQuery = document.getElementById('sendQuery')
      , sendBox = document.getElementById('sendBox')
      , store = window.localStorage
      , oldKey = store.getItem('key');
    
    
    sendQuery.addEventListener('click', function(){
        var key = queryNumber.value || null
          , match = queryMatch.value;
        
        if(key && key != ''){
          store.setItem('key', key);
        }
        // ./html/booklist.html?type=qx
        sendBox.setAttribute('href', './html/booklist.html?type=qx&key=' + key + '&match=' + match);
        store.setItem('match', match);
    });
    
    function appInit(){
        
        navigator.splashscreen.hide();
        
        var h = window.innerHeight
          , w = window.innerWidth;
        
        // console.log('w: ' + w + '--h:' + h);
        
        page.style.width = w + 'px';
        page.style.height = h + 'px';
        setBtn.innerHTML = '<a href="html/config.html"><i id="settings-icon" class="icon-cog"> </i><span id="settings-text">设置</span></a>';
        
        if(oldKey){
          queryNumber.setAttribute('placeholder', oldKey);
        }
    }
    
    // setBtn.addEventListener('click', sBtnClick, true);
    
    document.addEventListener('deviceready', appInit, false)
    function sBtnClick(){
        console.log('setting on click');
    }
    
})();
