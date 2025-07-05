const Factories = [{
  name: 'Cursor',
  startingPrice: 15,
  amount: 0,
  id: 1,
  cookiesPerSecond: 0.1,
  basePrice: 15,
  totalCookiesBaked: 0,
  firstBoughtTime: null,
  lore: `"Autoclicks once every 10 seconds."`
},
{
  name: 'Grandma',
  startingPrice: 100,
  amount: 0,
  id: 2,
  cookiesPerSecond: 1,
  basePrice: 100,
  totalCookiesBaked: 0,
  firstBoughtTime: null,
  lore: `"A nice grandma to bake more cookies."`
},
{
  name: 'Farm',
  startingPrice: 1100,
  amount: 0,
  id: 3,
  cookiesPerSecond: 8,
  basePrice: 1100,
  totalCookiesBaked: 0,
  firstBoughtTime: null,
  lore: `"Grows cookie plants from cookie seeds."`
},
{
  name: 'Mine',
  startingPrice: 12000,
  amount: 0,
  id: 4,
  cookiesPerSecond: 47,
  basePrice: 12000,
  totalCookiesBaked: 0,
  firstBoughtTime: null,
  lore: `"Mines out cookies dough and chocolate chips."`
},
{
  name: "Factory",
  startingPrice: 130000,
  amount: 0,
  id: 5,
  cookiesPerSecond: 260,
  basePrice: 130000,
  totalCookiesBaked: 0,
  firstBoughtTime: null,
  lore: `"Produces large quantities of cookies."`
}];

let Cookies = 13000;
let cookiesPerSecond = 0;

const FactoriesHTML = document.querySelector('.js-factories');


Factories.forEach((factory, index) => {
    let startingPrice = factory.startingPrice;
    const specificFactory = `
    <div class="shadow-box-surround">
      <div class="specific-factory" data-index="${index}">
      <img src="Images/Factories/${factory.name}.png" class="factory-image">
      <div class="factory-name-cost-container">
        <p class="factory-name">${factory.name}</p>
        <p class="factory-cost">${Math.floor(startingPrice)}</p>
      </div>
      <div class="factory-amount">
        <p class="factory-amount-p">${factory.amount}</p>
      </div>  
      </div>
    </div>
  `;
  FactoriesHTML.innerHTML += specificFactory;
});

  FactoriesHTML.addEventListener('click', (event) => {
    const factoryElement = event.target.closest('.specific-factory');
    if (!factoryElement) return;

    const index = factoryElement.dataset.index;
    const factory = Factories[index];

    if(Cookies < factory.startingPrice) {

    } else {
      Cookies -= factory.startingPrice;     

      if (factory.amount === 0) {
        factory.firstBoughtTime = Date.now();
      }
    }

    factoriesOwned = factory.amount; 
    factory.amount += 1;
    factory.startingPrice = factory.basePrice * Math.pow(1.15, factoriesOwned);

    factoryCost = document.querySelectorAll('.factory-cost');
    factoryAmount = document.querySelectorAll('.factory-amount p');

    factoryCost[index].innerHTML = Math.floor(factory.startingPrice);
    factoryAmount[index].innerHTML = factory.amount;

    updateCookiesCounters();
    hoverBoxUpdate(factory);
  });

  let factoryName = localStorage.getItem('FactoryName');
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
    <button class="cookie-click-button" onclick="bigCookie()"><img src="Images/Cookie.png" class="cookie-click-image"></button>
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


function bigCookie () {
  Cookies += 1;
  document.querySelector('.total-cookies-baked').innerHTML = `${Math.floor(Cookies)} cookies`;
}

function updateCookiesCounters() {
  cookiesPerSecond = calculateCookiesPerSecond();
  Cookies += cookiesPerSecond / 1000;
  document.querySelector('.total-cookies-baked').innerHTML = `${Math.floor(Cookies)} cookies`;
  document.querySelector('.cookies-per-second').innerHTML = `per second: ${Math.floor(cookiesPerSecond)}`;

  Factories.forEach((factory) => {
  if (factory.firstBoughtTime !== null || factory.amount > 0) {
    factory.totalCookiesBaked += factory.cookiesPerSecond;
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
  const gap = 25;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

  let left = rect.right + scrollLeft + gap;
  let top = rect.top + scrollTop;

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
  console.log(rect.top);
  console.log(rect.left)
});

FactoriesHTML.addEventListener('mouseout', function(event) {
  const hoverBox = document.querySelector('.hover-container');
  hoveredFactoryIndex = null;
  hoverBox.style.display = 'none';
});


let hoveredOverFactory = null;
function hoverBoxUpdate(factory) {
  const hoverHTML = `
    <div class="hover-specific-factory">
        <img src="Images/Upgrades/${factory.name}-Upgrade-1.png">
        <div class="hover-name-owned">
          <p class="hover-name-factory">${factory.name}</p>
          <p>owned: ${factory.amount}</p>
        </div>
        <p class="hover-cost">${Math.floor(factory.startingPrice)}</p>
        <div class="hover-lore">
          <p>${factory.lore}</p>
        </div>
        <div class="hover-basic-information-specific-factory">
          <p>each cursor produces <span class="span-color">${Math.floor(factory.cookiesPerSecond)} cookies per second</span></p>
          <p>${factory.amount} cursors producting <span class="span-color">${Math.floor(factory.amount * factory.cookiesPerSecond)} total cookies</span> per second (<span class="span-color">${((factory.amount * factory.cookiesPerSecond) /Cookies * 100).toFixed(1)}%</span> of total CpS)</p>
          <p><span class="span-color">${factory.totalCookiesBaked}</span> cookies clicked so far</p>
        </div>
    </div>
  `;
  hoverBox.innerHTML = hoverHTML;
}

let nameButton = document.querySelector('.change-name-container');

function changeName() {
  let changeNameButton = document.querySelector('.factory-username');
  changeNameButton.addEventListener('click', function(event) {
    // const clickEvent =  event.target.closest('.factory-username');
    if(!nameButton) return;

  ChangeNameClick();

  // const rect = clickEvent.getBoundingClientRect();
  // const nameButtonWidth = 268; 
  // const nameButtonHeight = 117;

  // const scrollTop = window.scrollY || document.documentElement.scrollTop;
  // const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

  // let left = (rect.right + scrollLeft) / 2
  // let top = (rect.top + scrollTop) / 2;

  // nameButton.style.left = `${left}px`;
  // nameButton.style.top = `${top}px`;
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

changeName();