const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

// Search through click
document.getElementById("search").addEventListener("keypress", function(event) {
  if (event.key === 'Enter')
  document.getElementById("search-btn").click();
});

// My api key
const KEY = '20494012-a1bf734eb56415ab93f2b2d27';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  toggleElement()
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}

const getImages = (query) => {
  setTimeout(() =>{
    fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
  }, 2000); //add setTimeout for show spinner
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.pop(img);
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image for slider.')
    return;
  }

  // show no of images select for slider
 
  let count = 0
  count = sliders.length;
  alert(`You have selected ${count} images for slider.`)

  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';

  // hide image aria
  imagesArea.style.display = 'none';

  // restrict slider change duration less then 0 millisecond
  const slideDuration = document.getElementById('duration');
  const duration = slideDuration.value || 1000;
  if(duration > 0){
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
  }
  else{
    alert('Slider change duration must be positive millisecond!!!')
    return;
  }
  
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
  toggleElement();
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

const toggleElement = () => {
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.toggle("d-none");
  imagesArea.classList.toggle("d-none");
}
