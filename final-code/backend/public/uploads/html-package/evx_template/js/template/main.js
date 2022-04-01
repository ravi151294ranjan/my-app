var tocJSONObj = {};
var glossaryJSONObj = {};
var isPreviewMode = false;
var tocJSONURL = "js/data/toc.json";
var glossaryJSONURL = "js/data/glossary.json";
$(window).load(function(e){
  document.title = courseTitle;
  $(window).resize(function(){
    resizeMainContainer(true);
  });
  var fileName = document.location.href;
  if(fileName.indexOf('mode=preview') >= 0){
    // need to call API to get JSON URL
    try{
      tocJSONURL = parent.getJSONURL();
    }catch(err){
      console.log(err);
      tocJSONURL = "js/data/toc.json";
    }
    isPreviewMode = true;
    $('.preloader').show();
  }
  loadJSON(tocJSONURL, function(data){
    tocJSONObj = data;
    TOC.init();
    $.after('2s').done(function(e){
      $('.preloader').fadeOut('fast');
    });
  });
  loadJSON(glossaryJSONURL, function(data){
    glossaryJSONObj = data;
    Glossary.init();
  });
  resizeMainContainer(true);
});
//
function resizeMainContainer(proportional){
  if(scaleContentToBrowser == false){
    return;
  }
  var div = $("#container");
  var currentWidth = div.outerWidth();
  var currentHeight = div.outerHeight();
  var availableHeight = window.innerHeight;
  var availableWidth = window.innerWidth;
  var scaleX = availableWidth / currentWidth;
  var scaleY = availableHeight / currentHeight;
  if (proportional == true) {
    scaleX = Math.min(scaleX, scaleY);
    scaleY = scaleX;
  }
  var wd = div.width() * scaleX;
  div.css({
    "left": "50%",
    'marginLeft': (-(wd/2))+'px',
    "top": "0",
    "transform-origin": "0 0",
    "transform": "scale(" + scaleX +"," + scaleY + ")"
  });
}