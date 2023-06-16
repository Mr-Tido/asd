
// Модальное окно

// Открыть модальное окно
document.getElementById("open-modal-btn").addEventListener("click", function() {
  document.getElementById("my-modal").classList.add("open")
})

document.getElementById("pasword").addEventListener("click", function() {
  document.getElementById("my-modal1").classList.add("open")
})

document.getElementById("pasword").addEventListener("click", function() {
  document.getElementById("my-modal").classList.remove("open")
})

// Закрыть модальное окно
document.getElementById("close-my-modal-btn").addEventListener("click", function() {
  document.getElementById("my-modal").classList.remove("open")
})
document.getElementById("close-my-modal-btn1").addEventListener("click", function() {
  document.getElementById("my-modal1").classList.remove("open")
})
// Закрыть модальное окно при нажатии на Esc
window.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
      document.getElementById("my-modal").classList.remove("open")
  }
});
window.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
      document.getElementById("my-modal1").classList.remove("open")
  }
});
// Закрыть модальное окно при клике вне его
document.querySelector("#my-modal .modal__box").addEventListener('click', event => {
  event._isClickWithInModal = true;
});
document.getElementById("my-modal").addEventListener('click', event => {
  if (event._isClickWithInModal) return;
  event.currentTarget.classList.remove('open');
});
document.querySelector("#my-modal1 .modal__box").addEventListener('click', event => {
  event._isClickWithInModal = true;
});
document.getElementById("my-modal1").addEventListener('click', event => {
  if (event._isClickWithInModal) return;
  event.currentTarget.classList.remove('open');
});

// Войти

// слайдер2



// SWIPER

const swiper = new Swiper('.swiper', {
  slidesPerView: 2,
  initialSlide: 3,
  nextButton: '.swiper-button-next',
  prevButton: '.swiper-button-prev',
  spaceBetween: 0,
  centeredSlides: true,
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },
});
// Nashi tovar



const swiper1 = new Swiper('.abb', {
  slidesPerView: 16,
  initialSlide: 2,
  nextButton: '.nextBtn',
  prevButton: '.prevBtn',
  spaceBetween: 0,
  centeredSlides: true,
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: '.nextBtn',
    prevEl: '.prevBtn',
  },

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },
});


    const slider = document.querySelectorAll(".items");
		// const slides = document.querySelectorAll(".item");
		// const button = document.querySelectorAll(".button");
    slider.forEach((slider) => {
      const slides = slider.querySelectorAll(".item");
		  const button = slider.querySelectorAll(".button");

      let current = 0;
		let prev = 4;
		let next = 1;

		for (let i = 0; i < button.length; i++) {
			button[i].addEventListener("click", () => i == 0 ? gotoPrev() : gotoNext());
		}

		const gotoPrev = () => current > 0 ? gotoNum(current - 1) : gotoNum(slides.length - 1);

		const gotoNext = () => current < 4 ? gotoNum(current + 1) : gotoNum(0);

		const gotoNum = number => {
			current = number;
			prev = current - 1;
			next = current + 1;

			for (let i = 0; i < slides.length; i++) {
				slides[i].classList.remove("active");
				slides[i].classList.remove("prev");
				slides[i].classList.remove("next");
			}

			if (next == 5) {
				next = 0;
			}

			if (prev == -1) {
				prev = 4;
			}

			slides[current].classList.add("active");
			slides[prev].classList.add("prev");
			slides[next].classList.add("next");
		}
    })
		

// slider 2 

const buttonHome = document.querySelector(".button-home")
const buttonGame = document.querySelector(".button-games")
const buttonStationery = document.querySelector(".button-stationery")

const slide1 = document.querySelector(".slide1")
const slide2 = document.querySelector(".slide2")
const slide3 = document.querySelector(".slide3")

function buttonHomeclick() {
  slide1.classList.remove("slide-none")
  slide2.classList.add("slide-none")
  slide3.classList.add("slide-none")
  buttonHome.classList.add("active-button")
  buttonGame.classList.remove("active-button")
  buttonStationery.classList.remove("active-button")
  buttonHome.classList.add("active-img")
  buttonGame.classList.remove("active-img")
  buttonStationery.classList.remove("active-img")
}

function buttonGameclick() {
  slide1.classList.add("slide-none")
  slide2.classList.remove("slide-none")
  slide3.classList.add("slide-none")
  buttonHome.classList.remove("active-button")
  buttonGame.classList.add("active-button")
  buttonStationery.classList.remove("active-button")
}

function bbuttonStationeryclick() {
  slide1.classList.add("slide-none")
  slide2.classList.add("slide-none")
  slide3.classList.remove("slide-none")
  buttonHome.classList.remove("active-button")
  buttonGame.classList.remove("active-button")
  buttonStationery.classList.add("active-button")
}

buttonHome.addEventListener('click',buttonHomeclick)
buttonGame.addEventListener('click',buttonGameclick)
buttonStationery.addEventListener('click',bbuttonStationeryclick)




const autorisationn= (email,password) => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  let raw = JSON.stringify({
    "email": "vlad.uhwatov@yandex.ru",
    "password": "SomePassword1"
  });
  
  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  return fetch("http://localhost:3000/api/auth/login", requestOptions)
    .then(response => response.text())
     .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

autorisationn().then((data)=> {
   console.log(data)
})


const inputPass = document.querySelector(".input_pasword")
const ButtonSubmit = document.getElementById("mars-once")
const inputEmail = document.querySelector(".input_email2")


function HandalFormSubmit (event){
  event.preventDefault()
  const data = {
    email: inputEmail.value,
    pass: inputPass.value
  }

  console.log(data)
  autorisationn(data)
  // window.location.href = "http://127.0.0.1:5500/Personal/Index.html"
}

ButtonSubmit.addEventListener('submit', HandalFormSubmit)