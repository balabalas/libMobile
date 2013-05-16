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
      , extraNav = document.getElementById('extraNavList')
      , extraNavLists = extraNav.querySelectorAll('li')
      , extraItems = extraList.querySelectorAll('.extra_item')
      , tBookName = document.getElementById('tBookName')
      , tBookTitle = document.getElementById('tBookTitle')
      , tBookAuthor = document.getElementById('tBookAuthor')
      , tBookNumber = document.getElementById('tBookNumber')
      , likeWrapper = document.getElementById('likeWrapper')
      , likeBtn = document.getElementById('likeBtn')
      , extraScroll = null
      , extraScrollOptions = {
          snap: 'li'
        , momentum: false
        , hScrollbar: false
        , vScrollbar: false
        , onScrollEnd: extraScrollEnd
        }
      , size = null
      , reQuery = false
      , db = null;
    
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
    
    function toggleLike(id, data){
      
      db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS favor (id unique, data)', [], function(tx, results){
        }, function(err){
          console.log('create table like failed');
        });
        
        tx.executeSql('SELECT * FROM favor where id=?', [id], function(tx, results){
          // select success;
          var len = results.rows.length;
          
          if(len < 1){
            tx.executeSql('INSERT INTO favor (id, data) VALUES (?,?)', [id,data], function(tx, res){
              console.log('insert table success.');
              likeBtn.style.color = '#991e57';
            }, function(tx, err){
              console.log(err.code + '-->msg: ' + err.message);
            });
          }
          else {
            tx.executeSql('DELETE FROM favor where id=?', [id]);
            likeBtn.style.color = '#fff';
          }
          console.log("Returned rows = " + len);
        }, function(tx, err){
          // select error
          console.log("Error select SQL: " + err.code + ' && ' + err.message);
        });
        
      }, function(err){
        // transaction error
        console.log('detail database error: ' + err.code + ' && ' + err.message);
      }, function(){
        // transaction success
        console.log('transaction success!!!');
      });
    }
    
    // check if it has been favored.
    function verifyFavor(id){
      db.transaction(function(tx){
        tx.executeSql('SELECT id FROM favor where id = ?', [id], function(tx, results){
          var len = results.rows.length;
          if(len < 1){
            likeBtn.style.color = '#fff';
          }
          else {
            likeBtn.style.color = '#991e57';
          }
        }, function(tx, err){
          console.log('verify select error.');
        });
      }, function(err){
        console.log('verify error.');
      }, function(){
        console.log('verify success.');
      });
    }
    
    function appReady(){
      
      checkReQuery();
      
      likeWrapper.addEventListener('click', function(){
        var data = JSON.stringify(book)
          , id = bookId + '';
        toggleLike(id, data);
      }, false);
      
      extraScroll = new iScroll('wrapper', extraScrollOptions);
      
      if(bookName){
        book.name = bookName;
      }
      else {
        book.name = '';
      }
      
      if(APP && APP.getMineSize){
        size = APP.getMineSize;
        APP.initDatabase();
      }
      else {
        size = function(e){
            var box = e.getBoundingClientRect();
            var w = box.width || (box.right - box.left);
            var h = box.height || (box.bottom - box.top);
            return {width:w, height:h};
        }
      }
      
      if(!APP.database){
        console.log('database can not access!');
        db = window.openDatabase("bistudb", "1.0", "Bistu library DB", 200000);
      }
      else {
        db = APP.database;
      }
      
      verifyFavor(bookId);
      
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
      
      var bnLen = obj.name.length
        , sw = 0
        , sh = 0;
      
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
      
      if(obj.intro && obj.intro.length > 0){
        extraItems[1].innerHTML = '<span id="bookIntro">' + obj.intro + '</span>';
      }
      else {
        extraItems[1].innerHTML = '<span id="bookIntro" style="font-size: 1.2em;">此书暂无简介</span>';
      }
      
      for(var i = 0, len = obj.sort.length; i < len; i++){
        var sspan = document.createElement('span');
        sspan.className = 'sort_item';
        
        if(obj.sort[i].length > 0){
          sspan.innerText = obj.sort[i];
        }
        else {
          sspan.innerText = '无';
        }
        
        extraItems[2].appendChild(sspan);
      }
      
      for(var i = 0, len = obj.info.length; i < len; i++){
        var ispan = document.createElement('span');
        ispan.className = 'sort_item';
        
        if(obj.info[i].length > 0){
          ispan.innerText = obj.info[i];
        }
        else {
          ispan.innerText = '无';
        }
        
        extraItems[3].appendChild(ispan);
      }
      
      APP.displayContent('pageContent');
      
      if(size){
        // console.log('scroll: ' + size(tScroller).width);
        // console.log('wrapper: ' + size(tWrapper).width);
        
        sw = size(tWrapper).width;
        sh = size(tWrapper).height;
        
        extraList.style.width = 4 * sw + 'px';
        extraList.style.height = sh + 'px';
        
        // console.log('sw: ' + sw + '--sh: ' + sh);
        
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
      
      tWrapper.style.visibility = 'visible';
      
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
      
      var index = extraScroll.currPageX;
      
      if(index === 0){
        tWrapper.className = 'wrapper_head';
      }
      else if(index === 3) {
        tWrapper.className = 'wrapper_tail';
      }
      else {
        tWrapper.className = 'wrapper_middle';
      }
      
      for(var i = 0, len = extraNavLists.length; i < len; i++){
        if(i === index){
          extraNavLists[i].className = 'extra_nav_active';
        }
        else {
          extraNavLists[i].className = '';
        }
      }
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


