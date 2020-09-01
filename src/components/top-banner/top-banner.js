let menuParents = document.querySelectorAll('.menu-page__item_parent');

for (let menuParent of menuParents){
  menuParent.addEventListener("mouseenter", function (e) {
    menuParent.classList.add('submenu-page__item_active');
  });
  menuParent.addEventListener("mouseleave", function (e) {
    menuParent.classList.remove('submenu-page__item_active');
  });
}

let menuPageBurger = document.querySelector('.menu-page__burger');
menuPageBurger.onclick = () => menuPageBurger.classList.toggle('active');



$(document).ready(function () {

  $('.menu-page__burger').on('click', function () {

    $(this).parent().siblings().slideToggle(400);
  });

});

/* for (let index = 0; index < menuParents.length; index++){
  const menuParent = menuParents[index];
  menuParent.addEventListener("mouseenter", function (e) {
    const submenuNumber = parseInt(menuParent.getAttribute('data-item'));
    submenuItems[submenuNumber].classList.add('submenu-page__item_active');
  })
} */
/* let menuBurger = document.querySelector('.menu-page__burger');

menuBurger.addEventListener("click", function (e) {
  menuBurger.classList.toggle('active');
}); */