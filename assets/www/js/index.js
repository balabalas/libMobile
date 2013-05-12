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
      , store = window.localStorage;
    
    document.addEventListener('deviceready', appInit)
    sendQuery.addEventListener('click', function(){
        var key = queryNumber.value
          , match = queryMatch.value;
        
        console.log('key:' + key + ' -- match:' + match);
        if(key != '')store.setItem('key', key);
        store.setItem('match', match);
    });
    
    function appInit(){
        
        navigator.splashscreen.hide();
        
        var h = window.innerHeight
          , w = window.innerWidth;
          
        page.style.width = w + 'px';
        page.style.height = (h - 20) + 'px';
          
        console.log("width: " + w + ' ### height: ' + h);
    }
    
    setBtn.addEventListener('click', sBtnClick, true);
    
    function sBtnClick(){
        console.log('setting on click');
    }
    
})();
