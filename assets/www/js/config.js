
(function(){
  
  var clsBtn = document.getElementById('clearFavor')
    , db = null;
  
  function clearFavors(){
    if(!db){
      return;
    }
    
    db.transaction(function(tx){
      tx.executeSql('DELETE FROM favor', [], function(tx, results){
        console.log('delete success!');
      }, function(tx, err){
        console.log('delete error.');
      });
    }, function(err){
      console.log('delete transaction error.');
    }, function(){
      console.log('delete transaction success.');
    });
  }
  
  function appReady(){
    
    if(APP && APP.database){
      db = APP.database;
    }
    else {
      db = db = window.openDatabase("bistudb", "1.0", "Bistu library DB", 200000);
    }
    
    clsBtn.addEventListener('click', clearFavors, true);
  }
  
  document.addEventListener('deviceready', appReady, false);
  
})();














