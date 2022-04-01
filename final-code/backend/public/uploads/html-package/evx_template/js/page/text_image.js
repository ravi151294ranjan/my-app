var jsonObj = {};
var isPreviewMode = false;
var pageID = "";
var jsonURL = "../js/data/text_image.json";
$(document).ready(function(e){
  $(window).resize(function(){
    resizeMainContainer(true);
  });
  resizeMainContainer(true);
  var fileURL = document.location.href;
  $('.preloader').show();
  if(fileURL.indexOf('mode=preview') >= 0){
    pageID = getParameter(fileURL, 'id');
    isPreviewMode = true;
    try{
      jsonURL = "/admin/content/preview-html/" + pageID;
      loadJSON(jsonURL, function(data){
        jsonObj = data;
        assignContent();
      });
    }catch(err){
      console.log(err);
      alert('Unable to fetch the content.');
    }
  }else{
    loadJSON(jsonURL, function(data){
      jsonObj = data;
      assignContent();
    });
  }
});
//assigning content and image
function assignContent(){
  var imgURL = jsonObj.data.path;
  $(".img").unbind().bind('load', onImageLoaded);
  $(".img").bind('error', function(e){
    console.log("-- image error --")
    $(".img").width(617);
    $(".img").height(367);
    onImageLoaded()
  });
  $(".img").attr('src', imgURL);
  $(".title").html(jsonObj.data.title);
  $(".img_txt").html(jsonObj.data.content);
  $(".img_txt").mCustomScrollbar({
    advanced:{ updateOnContentResize: true },
    scrollButtons: {enable: false}
  });
  resizeMainContainer(true);
}
// adjusting the height of the text to match with image
function onImageLoaded(){
  console.log("--image loaded--")
  var imgW = $(".img").width();
  var imgH = $(".img").height();
  var txtW = $('.container').width() - imgW;
  var imgTxtW = txtW - 40;
  $(".img_txt_container").width(txtW);
  $(".img_txt_container").height(imgH);
  $(".img_txt").width(imgTxtW);
  $(".img_txt").height(imgH - 30);
  $.after('2s').done(function(e){
    $('.preloader').fadeOut('fast');
  });
}
//
function resizeMainContainer(proportional){
  var div = $(".container");
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
  console.log(scaleX, scaleY, div.width() * scaleX);
  var wd = div.width() * scaleX;
  div.css({
    "left": "50%",
    'marginLeft': (-(wd/2))+'px',
    "top": "0",
    "transform-origin": "0 0",
    "transform": "scale(" + scaleX +"," + scaleY + ")",
    "position": "absolute"
  });
  $(".img_txt").css({
    "transform-origin": "0 0"
  });
}