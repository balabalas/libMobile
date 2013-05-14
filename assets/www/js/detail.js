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
      , tScroller = document.getElementById('scroller')
      , tWrapper = document.getElementById('wrapper')
      , extraList = document.getElementById('extraList')
      , extraItems = extraList.querySelectorAll('.extra_item')
      , tBookName = document.getElementById('tBookName')
      , tBookTitle = document.getElementById('tBookTitle')
      , tBookAuthor = document.getElementById('tBookAuthor')
      , tBookNumber = document.getElementById('tBookNumber')
      , extraScroll = null
      , extraScrollOptions = {
          snap: 'li'
        , momentum: false
        , hScrollbar: false
        , vScrollbar: false
        , onScrollEnd: extraScrollEnd
        }
      , size = null
      , reQuery = false;
    
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
      
      checkReQuery();
      
      var sw = 0, sh = 0;
      
      extraScroll = new iScroll('wrapper', extraScrollOptions);
      
      if(bookName){
        book.name = bookName;
      }
      
      if(APP && APP.getMineSize){
        size = APP.getMineSize;
      }
      else {
        size = function(e){
            var box = e.getBoundingClientRect();
            var w = box.width || (box.right - box.left);
            var h = box.height || (box.bottom - box.top);
            return {width:w, height:h};
        }
      }
      
      if(size){
        // console.log('scroll: ' + size(tScroller).width);
        // console.log('wrapper: ' + size(tWrapper).width);
        
        sw = size(tWrapper).width;
        sh = size(tWrapper).height;
        
        extraList.style.width = 4 * sw + 'px';
        extraList.style.height = sh + 'px';
        
        console.log('sw: ' + sw + '--sh: ' + sh);
        
        if(extraItems){
          extraItems[0].style.width = sw + 'px';
          extraItems[0].style.height = sh + 'px';
          extraItems[1].style.width = sw + 'px';
          extraItems[1].style.height = sh + 'px';
          extraItems[2].style.width = sw + 'px';
          extraItems[2].style.height = sh + 'px';
          extraItems[3].style.width = sw + 'px';
          extraItems[3].style.height = sh + 'px';
        }
      }
      
      if(reQuery){
        var cache_bookj = store.getItem('cache_book')
          , cache_book = JSON.parse(cache_bookj);
        
        drawScreen(true, cache_book);
      }
      else {
        getDetails();
      }
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
      
      if(obj.position && obj.position.length > 0){
        for(var i = 0, len = obj.position.length; i < len; i++){
          var span = document.createElement('span');
          span.className = 'positon_item';
          span.innerText = obj.position[i];
          extraItems[0].appendChild(span);
        }
      }
      else {
        extraItems[0].innerHTML = '<span class="position_item">未查到相关信息</span>';
      }
      
      if(obj.intro){
        extraItems[1].innerHTML = '<span id="bookIntro">' + obj.intro + '</span>'
      }
      
      for(var i = 0, len = obj.sort.length; i < len; i++){
        var sspan = document.createElement('span');
        sspan.className = 'sort_item';
        sspan.innerText = obj.sort[i];
        extraItems[2].appendChild(sspan);
      }
      
      for(var i = 0, len = obj.info.length; i < len; i++){
        var ispan = document.createElement('span');
        ispan.className = 'sort_item';
        ispan.innerText = obj.info[i];
        extraItems[3].appendChild(ispan);
      }
      
      extraScroll.refresh();
    }
    
    // draw screen when error.
    function drawError(){
      
    }
    
    // console.log('bookId: ' + bookId);
    
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
                book.position = d.bookStat.list;
                book.intro = d.bookInfo.intro;
                book.sort = [];
                book.sort.push(d.bookInfo.series);
                book.sort.push(d.bookInfo.annotation);
                book.info = [];
                book.info.push(d.bookInfo.size);
                book.info.push(d.bookInfo.publisher);
                
                store.setItem('cache_bookId', bookId);
                store.setItem('cache_book', JSON.stringify(book));
                
                drawScreen(true, book);
                
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
    
    function checkReQuery(){
      var currentId = bookId
        , oldId = store.getItem('cache_bookId');
      
      if(currentId === oldId){
        reQuery = true;
      }
      else {
        reQuery = false;
      }
      
    }
    
    document.addEventListener('deviceready', appReady, false);
    
})();


