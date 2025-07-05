const Factories = [{
  name: 'Cursor',
  startingPrice: 15,
  amount: 0,
  id: 1,
  cookiesPerSecond: 0.1,
  basePrice: 15
},
{
  name: 'Grandma',
  startingPrice: 100,
  amount: 0,
  id: 2,
  cookiesPerSecond: 1,
  basePrice: 100
},
{
  name: 'Farm',
  startingPrice: 1100,
  amount: 0,
  id: 3,
  cookiesPerSecond: 8,
  basePrice: 1100
},
{
  name: 'Mine',
  startingPrice: 12000,
  amount: 0,
  id: 4,
  cookiesPerSecond: 47,
  basePrice: 12000
}];

let Cookies = 10000;
let cookiesPerSecond = 0;

const FactoriesHTML = document.querySelector('.js-factories');


Factories.forEach((factory, index) => {
    let startingPrice = factory.startingPrice;
    const specificFactory = `
    <div class="specific-factory" data-index="${index}">
      <img src="Images/Factories/${factory.name}.png" class="factory-image">
      <div>
        <p class="factory-name">${factory.name}</p>
        <p class="factory-cost">${Math.floor(startingPrice)}</p>
      </div>
      <div class="factory-amount">
        <p>${factory.amount}</p>
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
      console.log(`Not enough cookies to purchase ${factory.name}`);
    } else {
      Cookies -= factory.startingPrice;
      let factoriesOwned = factory.amount;
      factory.amount += 1;
      factory.startingPrice = factory.basePrice * Math.pow(1.15, factoriesOwned - 1);

      factoryCost = document.querySelectorAll('.factory-cost');
      factoryAmount = document.querySelectorAll('.factory-amount p');

      factoryCost[index].innerHTML = Math.floor(factory.startingPrice);
      factoryAmount[index].innerHTML = factory.amount;
    }
  });

  let factoryName = '';
  const cookiesHTML = 
    // Left Side Cookie Clicker
  `
    <div>
      <p class="factory-name">${factoryName}</p>
      <p class="total-cookies-baked">${Math.floor(Cookies)} Total Cookies</p>
      <p class="cookies-per-second">${cookiesPerSecond} Cookies per Second</p>
      <button class="cookie-click-button"><img src="Images/Cookie.png" class="cookie-click-image"></button>
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
  cookiesPerSecond = calculateCookiesPerSecond();
  Cookies += cookiesPerSecond;
  document.querySelector('.total-cookies-baked').innerHTML = `${Math.floor(Cookies)} total baked`;
  document.querySelector('.cookies-per-second').innerHTML = `${cookiesPerSecond} cookies per second`;
}, 1000)

let sugarLumps = 0;
setInterval(() => {
  sugarLumps++;
  document.querySelector('.sugar-lumps').innerText = `${sugarLumps}`;
}, 1000);
