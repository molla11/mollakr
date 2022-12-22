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
});

const buttonNext = document.querySelector('.swiper-button-next');
const buttonPrev = document.querySelector('.swiper-button-prev');

window.onkeydown = (e) => {
  console.log(e);
  switch (e.key) {
    case 'ArrowLeft':
      buttonPrev.click();
      break;

    case 'ArrowRight':
      buttonNext.click();
      break;

    case ' ':
      buttonNext.click();
      break;

    case 'Enter':
      buttonNext.click();
      break;
    
    case 'PageUp':
      buttonPrev.click();
      break;

    case 'PageDown':
      buttonNext.click();
      break;
    
    case 'Home':
      for (let i = 0; i < 10; i++) { buttonPrev.click(); }
      break;
    
    case 'End':
      for (let i = 0; i < 10; i++) { buttonNext.click(); }
      break;

    default:
      break;
  }
}