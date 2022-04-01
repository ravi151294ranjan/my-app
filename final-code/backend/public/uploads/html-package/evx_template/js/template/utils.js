function loadJSON(jsonURL, callback){
  $.ajax({
    dataType: 'json',
    url: jsonURL,
    async: false,
    success: function(data){
      callback(data);
    },
    error: function(){
      alert("JSON file not found.")
    }
  });
}
//
function loadXML(xmlURL, callback){
  $.ajax({
    type: 'GET',
    url: "xml/"+xmlURL,
    async: false,
    dataType: "xml",
    success: function(data){
      callback(data);
    },
    error: function(){
      alert("XML file not found.")
    }
  });
}
//
function getParameter(locationURL, id){
  var paramsList = locationURL.split('&');
  for(var i=0;i<paramsList.length;i++){
    var param = paramsList[i].split("=");
    if(param[0] == id){
      return param[1];
    }
  }
}