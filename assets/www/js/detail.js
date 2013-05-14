/**
 * Get details for a book.
 * **/

(function(){
    
    'use strict';
    
    var store = window.localStorage
      , search = location.search
      , bookId = getSearchId(search) || store.getItem('bookId')
      , bookName = store.getItem('bookName')
      , bookdetails = null;
    
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
    
    console.log('bookId: ' + bookId);
    if(bookName) console.log(bookName);
    // Get details from web.
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
                  
                }
                
                var d = bookdetails;
                
                console.log(d.bookStat.number);
                
              }
              else {
                
              }
            }
        }
        
        xhr.open('GET', url);
        xhr.send(null);
        
    }
    
    
    
    
    document.addEventListener('deviceready', appReady, false);
    
})();


