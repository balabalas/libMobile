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
        receivedElement.setAttribute('style', 'display:block;position:static;');
        receivedElement.style.visibility = 'visible';
        receivedElement.style.height = parentElement.style.height;
      }
    };
    
    window.APP = APP;
    
})(this);










