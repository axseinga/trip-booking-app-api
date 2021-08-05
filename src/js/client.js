import "./../css/client.css";

import "regenerator-runtime";
import "whatwg-fetch";

import ExcursionsAPI from "./ExcursionsAPI";

console.log("client");

document.addEventListener("DOMContentLoaded", init);

async function init() {
    let excursions;
    let totalPrice;
    const manageAPI = new ExcursionsAPI();
    const APIurlExcursions = "http://localhost:3000/excursions";
    try {
        excursions = await manageAPI.getAPI(APIurlExcursions);
        displayTrips(excursions);
    } catch (error) {
        console.log(error);
    }
    // listen for adding trip to the basket
    const tripPanel = document.querySelector(".panel__excursions");
    tripPanel.addEventListener("submit", async function (e) {
        e.preventDefault();
        const trip = e.target.parentElement;
        addTripToBasket(trip, manageAPI);
        try {
            totalPrice = await calculateTotalPrice(manageAPI);
            console.log(totalPrice);
            displayTotalPrice(totalPrice);
        } catch (err) {
            console.log(err);
        }
    });

    // listen for deleting trips from basket
    const panelSummary = document.querySelector(".panel__form");
    panelSummary.addEventListener("click", async function (e) {
        e.preventDefault();
        const btn = e.target;
        if (btn.tagName === "A") {
            deleteItemfromBasket(btn, manageAPI);
            try {
                totalPrice = await calculateTotalPrice(manageAPI);
                console.log(totalPrice);
                displayTotalPrice(totalPrice);
            } catch (err) {
                console.log(err);
            }
        }
    });

    // listen for adding an order
    const orderBtn = document.querySelector(".order__field-submit");
    console.log(orderBtn);
    orderBtn.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("clicked");
    });
}

function displayTotalPrice(totalPrice) {
    const totalDisplay = document.querySelector(".order__total-price-value");
    console.log(totalDisplay);
    totalPrice > 0
        ? (totalDisplay.innerText = `${totalPrice} PLN`)
        : (totalDisplay.innerText = "0 PLN");
}

async function calculateTotalPrice(manageAPI) {
    let arrWithTotalPrices = [];
    let items;
    const basketAPI = "http://localhost:3000/orders";
    try {
        items = await manageAPI.getAPI(basketAPI);
        items.forEach((item) => {
            const total = item.total;
            console.log(total);
            arrWithTotalPrices.push(total);
        });
        console.log(arrWithTotalPrices);
        const totalPrice = arrWithTotalPrices.reduce((a, b) => a + b);
        return totalPrice;
    } catch (err) {
        console.log(err);
    }
}

// add trip to the basket //

async function addTripToBasket(trip, manageAPI) {
    const itemData = getItemData(trip);
    const [title, adult, child] = itemData;
    const item = createItem(title, adult, child);
    if (adult[1] !== "" && child[1] !== "") {
        const basketAPI = "http://localhost:3000/orders";
        manageAPI.addToAPI(basketAPI, item);
        clearInputs(trip);
        const itemWithId = await getItemWithId(basketAPI, manageAPI, itemData);
        const panel = document.querySelector(".panel__summary");
        const markup = createItemMarkup(itemWithId[0]);
        panel.insertAdjacentHTML("afterbegin", markup);
    }
}

async function getItemWithId(basketAPI, manageAPI, itemData) {
    let itemsWithId;

    try {
        itemsWithId = await manageAPI.getAPI(basketAPI);
        // filter for trip with matching id
        const matchedItem = itemsWithId.filter((item) => {
            if (
                item.title === itemData[0] &&
                item.adultNumber === +itemData[1][1] &&
                item.childNumber === +itemData[2][1]
            ) {
                return item;
            }
        });
        return matchedItem;
    } catch (err) {
        console.log(err);
    }
}

function getItemData(trip) {
    const title = getTitle(trip);
    const adult = getAdultData(trip);
    const child = getChildData(trip);
    const itemData = [title, adult, child];
    return itemData;
}

function createItem(title, adult, child) {
    return {
        title: title,
        adultNumber: +adult[1],
        adultPrice: +adult[0],
        childNumber: +child[1],
        childPrice: +child[0],
        total: +adult[1] * +adult[0] + +child[1] * +child[0],
    };
}

const getTitle = function (trip) {
    return trip.firstElementChild.firstElementChild.innerText;
};

const getAdultData = function (trip) {
    const adultField =
        trip.lastElementChild.firstElementChild.firstElementChild;
    const adultPrice = adultField.firstElementChild.innerText;
    const adultQt = adultField.lastElementChild.value;
    return [adultPrice, adultQt];
};

const getChildData = function (trip) {
    const childField =
        trip.lastElementChild.firstElementChild.nextElementSibling
            .firstElementChild;
    const childPrice = childField.firstElementChild.innerText;
    const childQt = childField.lastElementChild.value;
    return [childPrice, childQt];
};

// Display basket //

function createItemMarkup(trip) {
    //console.log(trip.id);
    return `
  <li class="summary__item" data-id="${trip.id}">
            <h3 class="summary__title">
              <span class="summary__name">${trip.title}</span>
              <strong class="summary__total-price">${trip.total}PLN</strong>
              <a href="#" class="summary__btn-remove" title="usuń">X</a>
            </h3>
            <p class="summary__prices">dorośli: ${trip.adultNumber} x ${trip.adultPrice}PLN, <br> dzieci: ${trip.childNumber} x ${trip.childPrice}PLN</p>
          </li>
  `;
}

// delete item from basket and from display //

function deleteItemfromBasket(btn, manageAPI) {
    const item = btn.parentElement.parentElement;
    const itemId = item.dataset.id;
    const basketAPI = "http://localhost:3000/orders";
    manageAPI.deleteFromAPI(basketAPI, itemId);
    item.remove();
}

// load trips to app from data.json //

function displayTrips(excursions) {
    excursions.forEach((trip) => {
        const title = trip.title;
        const description = trip.description;
        const adultPrice = trip.adultPrice;
        const childPrice = trip.childPrice;
        const markup = createTripMarkup(
            title,
            description,
            adultPrice,
            childPrice
        );
        const panel = document.querySelector(".panel__excursions");
        panel.insertAdjacentHTML("afterbegin", markup);
    });
}

function createTripMarkup(title, description, adultPrice, childPrice) {
    return `
      <li class="excursions__item">
            <header class="excursions__header">
              <h2 class="excursions__title">${title}</h2>
              <p class="excursions__description">
                ${description}
              </p>
            </header>
            <form class="excursions__form">
              <div class="excursions__field">
                <label class="excursions__field-name">
                  Dorosły: <span class="excursions__price">${adultPrice}</span>PLN x
                  <input class="excursions__field-input" name="adults" />
                </label>
              </div>
              <div class="excursions__field">
                <label class="excursions__field-name">
                  Dziecko: <span class="excursions__price">${childPrice}</span>PLN x
                  <input class="excursions__field-input" name="children" />
                </label>
              </div>
              <div class="excursions__field excursions__field--submit">
                <input
                  class="btn excursions__field-input excursions__field-input--submit"
                  value="dodaj do zamówienia"
                  type="submit"
                />
              </div>
            </form>
          </li>
      `;
}

// Clears //

const clearInput = function (input) {
    input.value = "";
};

const clearInputs = function (trip) {
    const adultField =
        trip.lastElementChild.firstElementChild.firstElementChild
            .lastElementChild;
    clearInput(adultField);
    const childField =
        trip.lastElementChild.firstElementChild.nextElementSibling
            .firstElementChild.lastElementChild;
    clearInput(childField);
};

// Clear basket - data.json //

/*async function clearBasket(manageAPI) {
    let basket;
    const APIurlbasket = "http://localhost:3000/orders";
    try {
        basket = await manageAPI.getAPI(APIurlbasket);
    } catch (error) {
        console.log(error);
    }
    console.log(basket);
    basket.forEach((item, index) => {
        console.log(manageAPI);
        console.log(item);
        item.manageAPI.deleteFromAPI(APIurlbasket, index);
    });
}*/
