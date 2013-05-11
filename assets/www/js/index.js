/***
 * index page.
 * 
 * **/
(function(){
    app.initialize();
    
    var setBtn = document.getElementById('settings')
      , page = document.getElementById('app');
    
    document.addEventListener('deviceready', appInit)
    
    
    
    function appInit(){
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
