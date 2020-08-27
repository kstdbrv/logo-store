$(document).ready(function () {

  $('.icon-menu').click(function (event) {
    $('.icon-menu,.menu__body').toggleClass('active');
    $('body').toggleClass('lock');
  });
  
});