import { Factories } from "./Factories.js";

let Cookies = 13;
let cookiesPerSecond = 0;
let hoveredFactoryIndex = null;
let selectedQuantity = 1;

const FactoriesHTML = document.querySelector('.js-factories');


Factories.forEach((factory, index) => {
    let startingPrice = factory.startingPrice.toLocaleString();
    const encodedName = encodeURIComponent(factory.name)
    const specificFactory = `
      <div class="specific-factory" data-index="${index}">
      <img src="Images/Factories/${encodedName}.png" class="factory-image">
      <div class="factory-name-cost-container">
        <p class="factory-name">${factory.name}</p>
        <p class="factory-cost">${startingPrice}</p>
      </div>
      <div class="factory-amount">
        <p class="factory-amount-p">${factory.amount}</p>
      </div>  
      </div>
  `;
  FactoriesHTML.innerHTML += specificFactory;
});

function targetClosestFactory (event) {
  const factoryElement = event.target.closest('.specific-factory');
  if (!factoryElement) return null;
  return factoryElement.dataset.index;
}

FactoriesHTML.addEventListener('click', (event) => {
  const index = targetClosestFactory(event);
  if(index === null) return;
  const factory = Factories[index];
  const totalCost = calculateTotalPrice(factory, selectedQuantity);
  if(selectedQuantity === 1) {
    if(isBuying) {
    buyFactory(selectedQuantity, index);
  } else if (!isBuying){
    sellFactory(selectedQuantity, index);
  }
  } else {
    if(isBuying && Cookies >= totalCost) {
    buyFactory(selectedQuantity, index);
  } else if(!isBuying){
    sellFactory(selectedQuantity, index);
  }
  }
});

function buyFactory (value, index) {

    const factory = Factories[index];
    if(Cookies < factory.startingPrice) {
      console.log("Not enough Cookies");
      return;
    } else {
      Cookies -= factory.startingPrice;     

      if (factory.amount === 0) {
        factory.firstBoughtTime = Date.now();
      }
    }

    factory.amount += value;
    factory.startingPrice = factory.basePrice * Math.pow(1.15, factory.amount);
    factory.totalPrice += factory.startingPrice;

    let factoryCost = document.querySelectorAll('.factory-cost');
    let factoryAmount = document.querySelectorAll('.factory-amount p');

    factoryCost[index].innerHTML = Math.floor(factory.startingPrice);
    factoryAmount[index].innerHTML = factory.amount;

    updateCookiesCounters();
    hoverBoxUpdate(factory);
  }

  function calculateTotalPrice(factory, quantity) {
    let totalCookiesPrice = 0;
    for (let i = 0; i < quantity; i++) {
      totalCookiesPrice += factory.basePrice * Math.pow(1.15, factory.amount - 1 - i);
      return Math.floor(totalCookiesPrice);
   }
  }


  function sellFactory (value, index) {
    const factory = Factories[index];
    if (value === "max") {
      value = factory.amount;
    }
    if(factory.amount < value) {
      console.log("No factories to sell");
      return;
    }  

      if (factory.amount === 0) {
        factory.firstBoughtTime = 0;
      }

    factory.amount -= value;
    factory.startingPrice = factory.basePrice * Math.pow(1.15, factory.amount);
    Cookies += factory.totalCookiesPrice;


    let factoryCost = document.querySelectorAll('.factory-cost');
    let factoryAmount = document.querySelectorAll('.factory-amount p');

    factoryCost[index].innerHTML = Math.floor(factory.startingPrice);
    factoryAmount[index].innerHTML = factory.amount;

    updateCookiesCounters();
    hoverBoxUpdate(factory);
  }

function bigCookie() {
  Cookies += 1;
  document.querySelector('.total-cookies-baked').innerHTML = `${Math.floor(Cookies)} cookies`;
}
  

  let factoryName = localStorage.getItem('FactoryName') || 'Isayso';
  const cookiesHTML = 
    // Left Side Cookie Clicker
  `
    <div class="factory-name-cookies-cps-container">
      <button class="factory-username" onclick="changeName()">${factoryName}'s bakery</button>
      <div class="total-baked-cps">
        <p class="total-cookies-baked">${Math.floor(Cookies)} cookies</p>
        <p class="cookies-per-second">per second: ${Math.floor(cookiesPerSecond)}</p>
      </div>
    </div>
        <div class="circle-container">
        <img src="Images/Cookie.png" class="cookie-click-image">
        <div class="circle-path"></div>
        <div class="spinning-block block-1"></div>
        <div class="spinning-block block-2"></div>
        <div class="spinning-block block-3"></div>
        <div class="spinning-block block-4"></div>
        <div class="spinning-block block-5"></div>
        <div class="spinning-block block-6"></div>
        <!-- Counter-clockwise blocks -->
        <div class="reverse-spinning-block reverse-block-1"></div>
        <div class="reverse-spinning-block reverse-block-2"></div>
        <div class="reverse-spinning-block reverse-block-3"></div>
        <div class="reverse-spinning-block reverse-block-4"></div>
        <div class="reverse-spinning-block reverse-block-5"></div>
        <div class="reverse-spinning-block reverse-block-6"></div>
    </div>
    <div class="milk-container">
      <img src="Images/MilkPlain.png" class="milk-image">
    </div>
  `;

document.querySelector('.cookie-container').innerHTML = cookiesHTML;


function calculateCookiesPerSecond() {
    let total = 0;
    Factories.forEach((factory) => {
    total += factory.cookiesPerSecond * factory.amount;
  });
  return total;
}

setInterval(() => {
  updateCookiesCounters();
}, 1)

let sugarLumps = 0;
setInterval(() => {
  sugarLumps++;
  document.querySelector('.sugar-lumps').innerText = `${sugarLumps}`;
}, 1000);

function updateCookiesCounters() {
  cookiesPerSecond = calculateCookiesPerSecond();
  Cookies += cookiesPerSecond * 4 / 1000;
  document.querySelector('.total-cookies-baked').innerHTML = `${Math.floor(Cookies)} cookies`;
  document.querySelector('.cookies-per-second').innerHTML = `per second: ${Math.floor(cookiesPerSecond)}`;

  Factories.forEach((factory) => {
    const now = Date.now();
    const elapsedTime = (now - factory.firstBoughtTime) / 1000;
  
    if (factory.firstBoughtTime !== null || factory.amount > 0) {
    factory.totalCookiesBaked = factory.cookiesPerSecond * factory.amount * elapsedTime;
  }
  });

  if (hoveredFactoryIndex !== null) {
    const factory = Factories[hoveredFactoryIndex];
    hoverBoxUpdate(factory);
  }
}

const hoverBox = document.querySelector('.hover-container');
FactoriesHTML.addEventListener('mouseover', function(event) {
  const factoryElement = event.target.closest('.specific-factory');
  if (!factoryElement) return;

  hoveredFactoryIndex = parseInt(factoryElement.dataset.index, 10);
  const factory = Factories[hoveredFactoryIndex];

  hoverBoxUpdate(factory);

  const rect = factoryElement.getBoundingClientRect();
  const hoverBoxWidth = 370; 
  const hoverBoxHeight = 190;
  const gap = -170;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

  let left = rect.right + scrollLeft + gap;
  let top = rect.top + scrollTop + 100;

  // If it would go off the right edge, flip to the left
  if (left + hoverBoxWidth > window.innerWidth + scrollLeft) {
    left = rect.left + scrollLeft - hoverBoxWidth - gap;
  }
  // If it would go off the bottom, adjust up
  if (top + hoverBoxHeight > window.innerHeight + scrollTop) {
    top = window.innerHeight + scrollTop - hoverBoxHeight - gap;
  }

  hoverBox.style.left = `${left}px`;
  hoverBox.style.top = `${top}px`;
  hoverBox.style.display = 'block';
});

FactoriesHTML.addEventListener('mouseout', function(event) {
  const hoverBox = document.querySelector('.hover-container');
  hoveredFactoryIndex = null;
  hoverBox.style.display = 'none';
});

function hoverBoxUpdate(factory) {
  let cookiesPerSecond = factory.cookiesPerSecond.toLocaleString();
  let startingPrice = factory.startingPrice.toLocaleString();

  const hoverHTML = `
    <div class="hover-specific-factory">
        <img src="Images/Upgrades/${factory.name}-Upgrade-1.png">
        <div class="hover-name-owned">
          <p class="hover-name-factory">${factory.name}</p>
          <p>owned: ${factory.amount}</p>
        </div>
        <p class="hover-cost">${Math.floor(startingPrice)}</p>
        <div class="hover-lore">
          <p>${factory.lore}</p>
        </div>
        <div class="hover-basic-information-specific-factory">
          <p>each cursor produces <span class="span-color">${Math.floor(cookiesPerSecond)} cookies per second</span></p>
          <p>${factory.amount} cursors producting <span class="span-color">${Math.floor(factory.amount * cookiesPerSecond)} total cookies</span> per second (<span class="span-color">${((factory.amount * cookiesPerSecond) /Cookies * 100).toFixed(1)}%</span> of total CpS)</p>
          <p><span class="span-color">${Math.floor(factory.totalCookiesBaked)}</span> cookies clicked so far</p>
        </div>
    </div>
  `;
  hoverBox.innerHTML = hoverHTML;
}

let nameButton = document.querySelector('.change-name-container');

function changeName() {
  let changeNameButton = document.querySelector('.factory-username');
  changeNameButton.addEventListener('click', function(event) {

    if(!nameButton) return;

  ChangeNameClick();

  nameButton.style.display = 'block';
  })
}

function ChangeNameClick() {
  const changeNameHTML = `
  <div class="change-name-wrap">
    <p class="change-name-p1">Name Your Bakery</p>
    <p class="bakery-name-p2">What should your bakery's name be?</p>
    <div class="input-box-container">
        <input class="name-input-open-up">
    </div>
    <div class="change-name-buttons-container">
        <button id="confirm-button">Confirm</button>
        <button id="random-button">Random</button>
        <button id="cancel-button">Cancel</button>
    </div>
  </div>
`;  
  nameButton.innerHTML = changeNameHTML;

  const confirmBtn = document.getElementById('confirm-button');
  const cancelBtn = document.getElementById('cancel-button');

  document.getElementById('confirm-button').addEventListener("click", function() {
  let inputValue = document.querySelector('.name-input-open-up').value;

  localStorage.setItem('FactoryName', inputValue);
  document.querySelector('.factory-username').innerText = `${inputValue}'s factory`;
  nameButton.style.display = 'none';
})

  document.getElementById('cancel-button').addEventListener('click', () => {
  nameButton.style.display = 'none';
});
}


const buyButton = document.querySelector('.buy-button');
const sellButton = document.querySelector('.sell-button');

let isBuying = true;


buyButton.addEventListener('click', function() {
  buyButton.classList.add('active-glow');
  sellButton.classList.remove('active-glow');
  document.querySelector('.quantity-max-button').style.display = 'none'
  isBuying = true;
});

sellButton.addEventListener('click', function() {
  sellButton.classList.add('active-glow');
  buyButton.classList.remove('active-glow');
  document.querySelector('.quantity-max-button').style.display = 'block'
  isBuying = false;
});


// ###################################################################################################

const allQuantityButtons = document.querySelectorAll('.quantity-button');
const quantityButtonOne = document.getElementById('1');
const quantityButtonTen = document.getElementById('10');
const quantityButtonHundred = document.getElementById('100');
const quantityButtonMax = document.getElementById('999');


quantityButtonOne.addEventListener('click', function () {
  allQuantityButtons.forEach(btn => btn.classList.remove('active-glow'));
  quantityButtonOne.classList.add('active-glow');
  selectedQuantity = 1; 
});

quantityButtonTen.addEventListener('click', function () {
  allQuantityButtons.forEach(btn => btn.classList.remove('active-glow'));
  quantityButtonTen.classList.add('active-glow');
  selectedQuantity = 10;  
});

quantityButtonHundred.addEventListener('click', function () {
  allQuantityButtons.forEach(btn => btn.classList.remove('active-glow'));
  quantityButtonHundred.classList.add('active-glow');
  selectedQuantity = 100;  
});

quantityButtonMax.addEventListener('click', function () {
  allQuantityButtons.forEach(btn => btn.classList.remove('active-glow'));
  quantityButtonMax.classList.add('active-glow');
  selectedQuantity = 'max';
});

// ###################################################################################################

const cookieClickImage = document.querySelector('.cookie-click-image');
cookieClickImage.addEventListener('click', bigCookie);
bigCookie();

changeName();