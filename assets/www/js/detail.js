/**
 * Get details for a book.
 * **/

(function(){
    
    'use strict';
    
    var store = window.localStorage
      , search = location.search
      , book = {}
      , bookId = getSearchId(search) || store.getItem('bookId')
      , bookName = store.getItem('bookName')
      , bookdetails = null
      , tBookName = document.getElementById('tBookName')
      , tBookTitle = document.getElementById('tBookTitle')
      , tBookAuthor = document.getElementById('tBookAuthor')
      , tBookNumber = document.getElementById('tBookNumber')
      , extraScroll 
      , extraScrollOptions = {
          snap: true
        , momentum: false
        , hScrollbar: false
        , vScrollbar: false
        , onScrollEnd: extraScrollEnd
      };
    
    // Get book id from location.search or localstorage.
    function getSearchId(str){
      if(str && str.length && str.length > 3){
        if(str.indexOf('?') !== 0){
          return false;
        }
        else {
          return str.slice(4);
        }
      }
      else {
        return false;
      }
    }
    
    function appReady(){
        getDetails();
    }
    
    function drawScreen(flag, obj){
      if(!flag || !obj){
        drawError();
        return;
      }
      
      var bnLen = obj.name.length;
      if(bnLen > 15){
        tBookName.style.fontSize = '1.5em';
      }
      tBookName.innerText = obj.name;
      tBookTitle.innerText = obj.title;
      tBookAuthor.innerText = obj.author;
      tBookNumber.innerText = obj.number;
      
      
      
      extraScroll = new iScroll('wrapper', extraScrollOptions);
      
    }
    
    // draw screen when error.
    function drawError(){
      
    }
    
    // console.log('bookId: ' + bookId);
    if(bookName){
        book.name = bookName;
    }
    
    // Get details from webserver.
    function getDetails(){
        var xhr = new XMLHttpRequest()
          , url = 'http://star.dmdgeeker.com/book?id=' + bookId;
        
        xhr.onreadystatechange = function(){
            if(xhr.readyState ===4){
              if((xhr.status >= 200 && xhr.status < 300)|| xhr.status === 304){
                var _detail = xhr.responseText;
                
                try {
                  bookdetails = JSON.parse(_detail);
                }
                catch(err){
                  console.log('Error: ' + err);
                }
                
                var d = bookdetails;
                
                book.number = d.bookStat.number;
                book.title = d.bookInfo.title;
                book.author = d.bookInfo.author;
                
                drawScreen(true, book);
                
                // console.log(d.bookStat.number);
                
              }
              else {
                console.log('status is ' + xhr.status);
              }
            }
        }
        
        xhr.open('GET', url);
        xhr.send(null);
        
    }
    
    function extraScrollEnd(){
      
    }
    
    
    document.addEventListener('deviceready', appReady, false);
    
})();


