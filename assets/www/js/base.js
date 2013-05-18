/***
 * base.js
 * **/
(function(window){
    
    "use strict";
    
    var APP = {
        toggle: function(id){
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');
    
            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        }
      , network: function(){
          var networkState = null
            , state = false;
          
          if(navigator || navigator.connection){
              networkState = navigator.connection.type;
          }
          
          if(networkState && Connection){
              switch(networkState){
                  case Connection.NONE: state = false; break;
                  case Connection.WIFI:
                  case Connection.CELL_2G:
                  case Connection.CELL_3G:
                  case Connection.CELL_4G:
                  case Connection.CELL:
                  case Connection.ETHERNET:
                  case Connection.UNKNOWN: state = true; break;
                  default: state = true;
              }
          }
          
          return state;
        }
      , unknowError: function(err){
          
          var errString = '';
          
          if(typeof err === 'object'){
              if(Array.isArray(err)){
                  err = err.join(',');
              }
              errString = err.toString();
          }
          else if(typeof err === 'string'){
              errString = err;
          }
          else {
              errString = '' + err;
          }
          
          return errString;
        }
      , getMineSize: function(e){
          var box = e.getBoundingClientRect()
            , w = box.width || (box.right - box.left)
            , h = box.height || (box.bottom - box.top);
            
          return {width:w, height:h};
      }
      , displayContent: function(id){
        var parentElement = document.getElementById(id)
          , listeningElement = parentElement.querySelector('.listening')
          , receivedElement = parentElement.querySelector('.received');
        
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        receivedElement.style.visibility = 'visible';
        parentElement.style.visibility = 'visible';
        receivedElement.style.height = parentElement.style.height;
      }
      , displayError: function(errInfo){
        var le = document.querySelector('.listening');
        le.innerHTML = '<div id="errorInfo"><span>' + errInfo + '</span><div>';
      }
      , onReady: function(){
        APP.initDatabase();
        document.addEventListener('deviceready', function(e){
          e.preventDefault();
        }, false);
      }
      , initDatabase: function(){
        var db = window.openDatabase("bistudb", "1.0", "Bistu library DB", 200000);
        db.transaction(function(tx){
          tx.executeSql('CREATE TABLE IF NOT EXISTS favor (id unique, data)');
        }, function(err){
          console.log('database error: ' + err.code);
        }, function(){
          // call when transaction success.
          // console.log('exec sql success');
        });
        APP.database = db;
      }
      , handleParams: function(params){
        /***
         * @param params (string)
         *    ex: ?type=qx&name=hello&age=12
         * **/
        if(!params){
          return null;
        }
        else if(typeof params !== 'string'){
          return null;
        }
        else if(params.length < 2){
          return null;
        }
        
        var str = params.slice(1)
          , rawArr = []
          , resArr = []
          , res = {}
          , len = 0;
        
        rawArr = str.split('&');
        len = rawArr.length;
        
        for(var i = 0; i < len; i++){
          var sArr = rawArr[i].split('=')
            , pre = sArr[0]
            , tail = sArr[1];
          
          res[pre] = tail;
        }
        
        return res;
      }
    };
    
    APP.onReady();
    window.APP = APP;
    
})(this);










