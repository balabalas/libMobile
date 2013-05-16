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
      , store = window.localStorage
      , oldKey = store.getItem('key');
    
    
    sendQuery.addEventListener('click', function(){
        var key = queryNumber.value
          , match = queryMatch.value;
        
        if(key && key != ''){
          store.setItem('key', key);
        }
        store.setItem('match', match);
    });
    
    function appInit(){
        
        navigator.splashscreen.hide();
        
        var h = window.innerHeight
          , w = window.innerWidth;
          
        page.style.width = w + 'px';
        page.style.height = (h - 20) + 'px';
        
        if(oldKey){
          queryNumber.setAttribute('placeholder', oldKey);
        }
          
    }
    
    setBtn.addEventListener('click', sBtnClick, true);
    
    document.addEventListener('deviceready', appInit, false)
    function sBtnClick(){
        console.log('setting on click');
    }
    
})();
