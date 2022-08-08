$(function () {

  "use strict";

  const $window = $(window);
  const $body = $('body');

  class Slideshow {
    constructor(userOptions = {}) {
      const defaultOptions = {
        $el: $('.slideshow'),
        showArrows: false,
        showPagination: true,
        duration: 6000,
        autoplay: true
      };
      let options = Object.assign({}, defaultOptions, userOptions);
      this.$el = options.$el;
      this.maxSlide = this.$el.find($('.js-slider-home-slide')).length;
      this.showArrows = this.maxSlide > 1 ? options.showArrows : false;
      this.showPagination = options.showPagination;
      this.currentSlide = 1;
      this.isAnimating = false;
      this.animationDuration = 1200;
      this.autoplaySpeed = options.duration;
      this.interval;
      this.$controls = this.$el.find('.js-slider-home-button');
      this.autoplay = this.maxSlide > 1 ? options.autoplay : false;
      this.$el.on('click', '.js-slider-home-next', event => this.nextSlide());
      this.$el.on('click', '.js-slider-home-prev', event => this.prevSlide());
      this.$el.on('click', '.js-pagination-item', event => {
        if (!this.isAnimating) {
          this.preventClick();
          this.goToSlide(event.target.dataset.slide);
        }
      });
      this.init();
    }

    init() {
      this.goToSlide(1);

      if (this.autoplay) {
        this.startAutoplay();
      }

      if (this.showPagination) {
        let paginationNumber = this.maxSlide;
        let pagination = '<div class="pagination"><div class="container">';

        for (let i = 0; i < this.maxSlide; i++) {
          let item = `<span class="pagination__item js-pagination-item ${i === 0 ? 'is-current' : ''}" data-slide=${i + 1}>${i + 1}</span>`;
          pagination = pagination + item;
        }

        pagination = pagination + '</div></div>';
        this.$el.append(pagination);
      }
    }

    preventClick() {
      this.isAnimating = true;
      this.$controls.prop('disabled', true);
      clearInterval(this.interval);
      setTimeout(() => {
        this.isAnimating = false;
        this.$controls.prop('disabled', false);

        if (this.autoplay) {
          this.startAutoplay();
        }
      }, this.animationDuration);
    }

    goToSlide(index) {
      this.currentSlide = parseInt(index);

      if (this.currentSlide > this.maxSlide) {
        this.currentSlide = 1;
      }

      if (this.currentSlide === 0) {
        this.currentSlide = this.maxSlide;
      }

      const newCurrent = this.$el.find('.js-slider-home-slide[data-slide="' + this.currentSlide + '"]');
      const newPrev = this.currentSlide === 1 ? this.$el.find('.js-slider-home-slide').last() : newCurrent.prev('.js-slider-home-slide');
      const newNext = this.currentSlide === this.maxSlide ? this.$el.find('.js-slider-home-slide').first() : newCurrent.next('.js-slider-home-slide');
      this.$el.find('.js-slider-home-slide').removeClass('is-prev is-next is-current');
      this.$el.find('.js-pagination-item').removeClass('is-current');

      if (this.maxSlide > 1) {
        newPrev.addClass('is-prev');
        newNext.addClass('is-next');
      }

      newCurrent.addClass('is-current');
      this.$el.find('.js-pagination-item[data-slide="' + this.currentSlide + '"]').addClass('is-current');
    }

    nextSlide() {
      this.preventClick();
      this.goToSlide(this.currentSlide + 1);
    }

    prevSlide() {
      this.preventClick();
      this.goToSlide(this.currentSlide - 1);
    }

    startAutoplay() {
      this.interval = setInterval(() => {
        if (!this.isAnimating) {
          this.nextSlide();
        }
      }, this.autoplaySpeed);
    }

    destroy() {
      this.$el.off();
    }

  }

  (function () {
    let loaded = false;
    let maxLoad = 3000;

    function load() {
      const options = {
        showPagination: true
      };
      let slideShow = new Slideshow(options);
    }

    function addLoadClass() {
      $body.addClass('is-loaded');
      setTimeout(function () {
        $body.addClass('is-animated');
      }, 600);
    }

    $window.on('load', function () {
      if (!loaded) {
        loaded = true;
        load();
      }
    });
    setTimeout(function () {
      if (!loaded) {
        loaded = true;
        load();
      }
    }, maxLoad);
    addLoadClass();
  })();

  //===== Prealoder

  $(window).on('load', function (event) {
    $('.preloader').delay(500).fadeOut(500);
  });


  //===== Mobile Menu 

  $(".navbar-toggler").on('click', function () {
    $(this).toggleClass('active');
  });

  $(".navbar-nav a").on('click', function () {
    $(".navbar-toggler").removeClass('active');
  });


  //===== close navbar-collapse when a  clicked

  $(".navbar-nav a").on('click', function () {
    $(".navbar-collapse").removeClass("show");
  });


  //===== Sticky

  $(window).on('scroll', function (event) {
    var scroll = $(window).scrollTop();
    if (scroll < 10) {
      $(".header-area").removeClass("sticky");
    } else {
      $(".header-area").addClass("sticky");
    }
  });


  //===== One Page Nav

  $('#nav').onePageNav({
    filter: ':not(.external)',
    currentClass: 'active',
  });


  //=====  Slick

  function mainSlider() {
    var BasicSlider = $('.slider-active');
    BasicSlider.on('init', function (e, slick) {
      var $firstAnimatingElements = $('.single-slider:first-child').find('[data-animation]');
      doAnimations($firstAnimatingElements);
    });
    BasicSlider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
      var $animatingElements = $('.single-slider[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
      doAnimations($animatingElements);
    });
    BasicSlider.slick({
      autoplay: true,
      autoplaySpeed: 5000,
      dots: false,
      fade: true,
      arrows: false,
      responsive: [
        { breakpoint: 767, settings: { dots: false, arrows: false } }
      ]
    });

    function doAnimations(elements) {
      var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      elements.each(function () {
        var $this = $(this);
        var $animationDelay = $this.data('delay');
        var $animationType = 'animated ' + $this.data('animation');
        $this.css({
          'animation-delay': $animationDelay,
          '-webkit-animation-delay': $animationDelay
        });
        $this.addClass($animationType).one(animationEndEvents, function () {
          $this.removeClass($animationType);
        });
      });
    }
  }
  mainSlider();



  //=====  Slick product items active

  $('.product-items-active').slick({
    dots: false,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 3,
    adaptiveHeight: true,
    arrows: true,
    prevArrow: '<span class="prev"><i class="lni-chevron-left"></i></span>',
    nextArrow: '<span class="next"><i class="lni-chevron-right"></i></span>',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: false,
          dots: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: false,
          dots: true,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: false,
        }
      }
    ]
  });


  //=====  Slick Showcase active

  $('.showcase-active').slick({
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    arrows: true,
    prevArrow: '<span class="prev"><i class="lni-arrow-left"></i></span>',
    nextArrow: '<span class="next"><i class="lni-arrow-right"></i></span>',
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        }
      },
      {
        breakpoint: 576,
        settings: {
          arrows: false,
        }
      }
    ]
  });


  //=====  Slick testimonial active

  $('.testimonial-active').slick({
    dots: false,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    arrows: false,
    adaptiveHeight: true,
  });




  //====== Magnific Popup

  $('.Video-popup').magnificPopup({
    type: 'iframe'
    // other options
  });


  //===== Back to top

  // Show or hide the sticky footer button
  $(window).on('scroll', function (event) {
    if ($(this).scrollTop() > 600) {
      $('.back-to-top').fadeIn(200)
    } else {
      $('.back-to-top').fadeOut(200)
    }
  });

  //Animate the scroll to yop
  $('.back-to-top').on('click', function (event) {
    event.preventDefault();

    $('html, body').animate({
      scrollTop: 0,
    }, 1500);
  });


  //====== Slick product image

  $('.product-image').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: '<span class="prev"><i class="lni-chevron-left"></i></span>',
    nextArrow: '<span class="next"><i class="lni-chevron-right"></i></i></span>',
    dots: false,
  });


  //====== Nice Number

  $('input[type="number"]').niceNumber({

  });


  //=====  Rating selection

  var $star_rating = $('.star-rating .fa');

  var SetRatingStar = function () {
    return $star_rating.each(function () {
      if (parseInt($star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
        return $(this).removeClass('fa-star-o').addClass('fa-star');
      } else {
        return $(this).removeClass('fa-star').addClass('fa-star-o');
      }
    });
  };

  $star_rating.on('click', function () {
    $star_rating.siblings('input.rating-value').val($(this).data('rating'));
    return SetRatingStar();
  });

  SetRatingStar();
});

popupWhatsApp = () => {

  let btnClosePopup = document.querySelector('.closePopup');
  let btnOpenPopup = document.querySelector('.whatsapp-button');
  let popup = document.querySelector('.popup-whatsapp');
  let sendBtn = document.getElementById('send-btn');

  btnClosePopup.addEventListener("click", () => {
     popup.classList.toggle('is-active-whatsapp-popup')
  })

  btnOpenPopup.addEventListener("click", () => {
     popup.classList.toggle('is-active-whatsapp-popup')
     popup.style.animation = "fadeIn .6s 0.0s both";
  })

  sendBtn.addEventListener("click", () => {
     let msg = document.getElementById('whats-in').value;
     let relmsg = msg.replace(/ /g, "%20");
     //just change the numbers "1515551234567" for your number. Don't use +001-(555)1234567     
     window.open('https://wa.me/573209197947?text=' + relmsg, '_blank');

  });

  /* Open pop-up in 15 seconds */
  /* setTimeout(() => {
    popup.classList.toggle('is-active-whatsapp-popup');
  }, 8000); */

}

popupWhatsApp();