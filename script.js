const uls = document.querySelectorAll("ul");

uls.forEach((ul) => {
  const resetClass = ul.parentNode.getAttribute("class");
  const lis = ul.querySelectorAll("li");

  lis.forEach((li) => {
    li.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.currentTarget;

      if (
        target.classList.contains("active") ||
        target.classList.contains("follow")
      ) {
        return;
      }

      ul.parentNode.setAttribute(
        "class",
        `${resetClass} ${target.getAttribute("data-where")}-style`
      );

      lis.forEach((item) => clearClass(item, "active"));

      setClass(target, "active");
    });
  });
});

function clearClass(node, className) {
  node.classList.remove(className);
}

function setClass(node, className) {
  node.classList.add(className);
}




// Params
let mainSliderSelector = '.main-slider',
    navSliderSelector = '.nav-slider',
    interleaveOffset = 0.5;

// Main Slider
let mainSliderOptions = {
      loop: true,
      speed:1000,
      autoplay:{
        delay:3000
      },
      loopAdditionalSlides: 10,
      grabCursor: true,
      watchSlidesProgress: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      on: {
        init: function(){
          this.autoplay.stop();
        },
        imagesReady: function(){
          this.el.classList.remove('loading');
          this.autoplay.start();
        },
        slideChangeTransitionEnd: function(){
          let swiper = this,
              captions = swiper.el.querySelectorAll('.caption');
          for (let i = 0; i < captions.length; ++i) {
            captions[i].classList.remove('show');
          }
          swiper.slides[swiper.activeIndex].querySelector('.caption').classList.add('show');
        },
        progress: function(){
          let swiper = this;
          for (let i = 0; i < swiper.slides.length; i++) {
            let slideProgress = swiper.slides[i].progress,
                innerOffset = swiper.width * interleaveOffset,
                innerTranslate = slideProgress * innerOffset;
           
            swiper.slides[i].querySelector(".slide-bgimg").style.transform =
              "translateX(" + innerTranslate + "px)";
          }
        },
        touchStart: function() {
          let swiper = this;
          for (let i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = "";
          }
        },
        setTransition: function(speed) {
          let swiper = this;
          for (let i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = speed + "ms";
            swiper.slides[i].querySelector(".slide-bgimg").style.transition =
              speed + "ms";
          }
        }
      }
    };
let mainSlider = new Swiper(mainSliderSelector, mainSliderOptions);

// Navigation Slider
let navSliderOptions = {
      loop: true,
      loopAdditionalSlides: 10,
      speed:1000,
      spaceBetween: 5,
      slidesPerView: 5,
      centeredSlides : true,
      touchRatio: 0.2,
      slideToClickedSlide: true,
      direction: 'vertical',
      on: {
        imagesReady: function(){
          this.el.classList.remove('loading');
        },
        click: function(){
          mainSlider.autoplay.stop();
        }
      }
    };
let navSlider = new Swiper(navSliderSelector, navSliderOptions);

// Matching sliders
mainSlider.controller.control = navSlider;
navSlider.controller.control = mainSlider;




//Countdown

const newYearEl = document.getElementById("date");
const daysEl = document.getElementById("days");
const daysElCurr = daysEl.getElementsByClassName("curr");
const daysElNext = daysEl.getElementsByClassName("next");
const hoursEl = document.getElementById("hours");
const hoursElCurr = hoursEl.getElementsByClassName("curr");
const hoursElNext = hoursEl.getElementsByClassName("next");
const minsEl = document.getElementById("mins");
const minsElCurr = minsEl.getElementsByClassName("curr");
const minsElNext = minsEl.getElementsByClassName("next");
const secondsEl = document.getElementById("seconds");
const secondsElCurr = secondsEl.getElementsByClassName("curr");
const secondsElNext = secondsEl.getElementsByClassName("next");

const newYear = new Date().getFullYear() + 1;
let newYearTime = new Date("2023-04-14 18:30:00");
newYearTime = new Date(
  newYearTime.getTime() - new Date().getTimezoneOffset() * 60 * 1000
);

function updateAllCountdowns() {
  const dates = {
    current: {
      elements: [daysElCurr, hoursElCurr, minsElCurr, secondsElCurr],
      values: ["00", "00", "00", "00"]
    },
    next: {
      elements: [daysElNext, hoursElNext, minsElNext, secondsElNext],
      values: ["00", "00", "00", "00"]
    },
    general: {
      elements: [daysEl, hoursEl, minsEl, secondsEl]
    }
  };
  const currentDate = new Date();
  updateCountdown(dates.current, currentDate, true);
  const nextDate = new Date(
    currentDate.setSeconds(currentDate.getSeconds() + 1)
  );
  updateCountdown(dates.next, nextDate, false);
  for (let i = 0; i < dates.current.values.length; i++) {
    if (dates.current.values[i] - dates.next.values[i] !== 0) {
      dates.general.elements[i].classList.remove("flip");
    }
    setTimeout(function () {
      dates.general.elements[i].classList.add("flip");
    }, 50);
  }
}

function updateCountdown(dates, currentTime, isCurrent) {
  const totalSeconds = (currentTime - newYearTime) / 1000;

  const days = Math.floor(totalSeconds / 3600 / 24);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const mins = Math.floor(totalSeconds / 60) % 60;
  const seconds = Math.floor(totalSeconds) % 60;

  if (currentTime.getMonth() == 0 && currentTime.getDate() <= 2) {
    dates.values = ["00", "00", "00", "00"];
    for (let i = 0; i < dates.elements.length; i++) {
      for (let j = 0; j < daysElCurr.length; j++) {
        dates.elements[i][j].innerHTML = dates.values[i];
        if (isCurrent) {
          newYearEl.innerHTML = newYear - 1;
        }
      }
    }

    return;
  }

  dates.values = [
    days,
    formatTime(hours),
    formatTime(mins),
    formatTime(seconds)
  ];

  for (let i = 0; i < dates.elements.length; i++) {
    for (let j = 0; j < daysElCurr.length; j++) {
      dates.elements[i][j].innerHTML = dates.values[i];
    }
  }
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

updateAllCountdowns();
setInterval(updateAllCountdowns, 1000);


AOS.init({
  duration: 1000
});

/* 
const btn = document.getElementById('side-menu');

btn.addEventListener('click', () => {
  const box = document.getElementsByClassName('swiper-wrapper'&&'')[0];

  // 👇️ removes the element from the DOM
   box.style.display = 'none';
});*/