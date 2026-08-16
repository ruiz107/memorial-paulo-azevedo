jQuery(document).ready(function ($) {

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function () {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Stick the header at top on scroll
  $("#header").sticky({
    topSpacing: 0,
    zIndex: '50'
  });

  // Intro background carousel
  $("#intro-carousel").owlCarousel({
    autoplay: true,
    dots: false,
    loop: true,
    animateOut: 'fadeOut',
    items: 1
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show'
    },
    speed: 400
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function (e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function (e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function (e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smooth scroll for the menu and links with .scrollto classes
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (!$('#header').hasClass('header-fixed')) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });


  // Porfolio - uses the magnific popup jQuery plugin
  $('.portfolio-popup').magnificPopup({
    type: 'image',
    removalDelay: 300,
    mainClass: 'mfp-fade',
    gallery: {
      enabled: true
    },
    zoom: {
      enabled: true,
      duration: 300,
      easing: 'ease-in-out',
      opener: function (openerElement) {
        return openerElement.is('img') ? openerElement : openerElement.find('img');
      }
    }
  });  
    
  // Wraps the currently displayed lightbox image with a draggable
  // before/after slider whenever the active item has a "data-restored" photo.
  function initCompareSlider(mfp) {
    var item = mfp.currItem;
    if (!item || !item.img) return;

    var restoredSrc = item.el && item.el.data('restored');
    var $img = item.img;

    // Already wrapped for this exact image (e.g. duplicate load event).
    if ($img.parent().hasClass('compare-wrap')) {
      if (!restoredSrc) {
        $img.unwrap();
      }
      return;
    }

    if (!restoredSrc) return;

    var $wrap = $img.wrap('<div class="compare-wrap"></div>').parent();

    var $restored = $('<img class="compare-restored" alt="">').attr('src', restoredSrc);
    var $handle = $('<div class="compare-handle"><span class="compare-handle-grip">&#8596;</span></div>');
    var $labelOriginal = $('<span class="compare-label compare-label-original">Original</span>');
    var $labelRestored = $('<span class="compare-label compare-label-restored">Restaurada com IA</span>');

    $wrap.append($restored, $handle, $labelOriginal, $labelRestored);

    function setPosition(percent) {
      percent = Math.max(0, Math.min(100, percent));
      $restored.css('clip-path', 'inset(0 ' + (100 - percent) + '% 0 0)');
      $handle.css('left', percent + '%');
    }
    setPosition(50);

    var dragging = false;

    function moveTo(clientX) {
      var rect = $wrap[0].getBoundingClientRect();
      if (!rect.width) return;
      setPosition(((clientX - rect.left) / rect.width) * 100);
    }

    $handle.on('mousedown touchstart', function (e) {
      dragging = true;
      e.stopPropagation();
      e.preventDefault();
    });

    $wrap.on('mousedown touchstart', function (e) {
      if ($(e.target).closest('.compare-handle').length) return;
      dragging = true;
      var clientX = e.type === 'touchstart' ? e.originalEvent.touches[0].clientX : e.clientX;
      moveTo(clientX);
      e.preventDefault();
    });

    $(document).on('mousemove.compare touchmove.compare', function (e) {
      if (!dragging) return;
      var clientX = e.type === 'touchmove' ? e.originalEvent.touches[0].clientX : e.clientX;
      moveTo(clientX);
    });

    $(document).on('mouseup.compare touchend.compare', function () {
      dragging = false;
    });
  }

  $('.fotos-popup').magnificPopup({
    type: 'image',
    removalDelay: 300,
    mainClass: 'mfp-fade',
    gallery: {
      enabled: true
    },
    zoom: {
      enabled: true,
      duration: 300,
      easing: 'ease-in-out',
      opener: function (openerElement) {
        return openerElement.is('img') ? openerElement : openerElement.find('img');
      }
    },
    callbacks: {
      imageLoadComplete: function () {
        initCompareSlider(this);
      },
      close: function () {
        $(document).off('.compare');
      }
    }
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });

  // Clients carousel (uses the Owl Carousel library)
  $(".clients-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 2
      },
      768: {
        items: 4
      },
      900: {
        items: 6
      }
    }
  });


});
