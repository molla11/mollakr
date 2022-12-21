const mySwiper = new Swiper('.swiper-container', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
  },
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
  },
  autoplay: {
    delay: 10000,
  },
});