new Swiper(".slide-container", {
  slidesPerView: 3,
  spaceBetween: 25,
  loop: true,
  centeredSlides: true,
  grabCursor: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
  0: { slidesPerView: 1 },
  520: { slidesPerView: 2 },
  950: { slidesPerView: 3 }
}

});
