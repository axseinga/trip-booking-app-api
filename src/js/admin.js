import "./../css/admin.css";

import "regenerator-runtime";
import "whatwg-fetch";

import ExcursionsAPI from "./ExcursionsAPI";

document.addEventListener("DOMContentLoaded", init);

console.log("admin");

async function init() {
    // load excursion view for admin
    const manageAPI = new ExcursionsAPI();
    const APIurl = "http://localhost:3000/excursions";
    try {
        const excursions = await manageAPI.getAPI(APIurl);
        console.log(excursions);
        const markups = createTrips(excursions);
        loadTrips(markups);
    } catch (error) {
        console.log(error);
    }
    // add new trip to the panel //
    const addBtn = document.querySelector(".order__field-submit");
    addBtn.addEventListener("click", function (e) {
        e.preventDefault();
        addTrip(APIurl, manageAPI);
    });
    // delete trips from the panel //
}

// Add new trip to the admin panel //

function addTrip(APIurl, manageAPI) {
    const tripData = getTripData();
    manageAPI.addToAPI(APIurl, tripData);
    const markup = createTrip(tripData);
    const excursionsPanel = document.querySelector(".panel__excursions");
    excursionsPanel.insertAdjacentHTML("afterbegin", markup);
}

function createTrip(tripData) {
    const title = tripData.title;
    const description = tripData.description;
    const adultPrice = tripData.adultPrice;
    const childPrice = tripData.childPrice;
    const markup = createTripsMarkup(
        title,
        description,
        adultPrice,
        childPrice
    );
    return markup;
}

function getTripData() {
    const title = document.querySelector(".form__field").value;
    const description = document.querySelector(".form__field--longtext").value;
    const adultPrice = document.querySelector("input[name=adult]").value;
    const childPrice = document.querySelector("input[name=child]").value;
    return {
        title: title,
        description: description,
        adultPrice: adultPrice,
        childPrice: childPrice,
    };
}

// Create and load trips from excursions.json //

function loadTrips(markups) {
    const excursionsPanel = document.querySelector(".panel__excursions");
    if (Array.isArray(markups)) {
        markups.forEach((markup) =>
            excursionsPanel.insertAdjacentHTML("afterbegin", markup)
        );
    } else return;
}

function createTrips(excursions) {
    let markups = [];
    excursions.forEach((excursion) => {
        const title = excursion.title;
        const description = excursion.description;
        const adultPrice = excursion.adultPrice;
        const childPrice = excursion.childPrice;
        const data = [title, description, adultPrice, childPrice]; // ?
        const markup = createTripsMarkup(
            title,
            description,
            adultPrice,
            childPrice
        );
        markups.push(markup);
    });
    return markups;
}

function createTripsMarkup(title, description, adultPrice, childPrice) {
    return `
        <li data-id="1" class="excursions__item">
        <header class="excursions__header">
            <h2 class="excursions__title">${title}</h2>
            <p class="excursions__description">${description}</p>
        </header>
        <form class="excursions__form">
            <div class="excursions__field">
                <label class="excursions__field-name">
                    Dorosły: <strong>${adultPrice}</strong>PLN
                </label>
            </div>
            <div class="excursions__field">
                <label class="excursions__field-name">
                    Dziecko: <strong>${childPrice}</strong>PLN
                </label>
            </div>
            <div class="excursions__field   excursions__field--submit">
                <input 
                    class="excursions__field-input  excursions__field-input--update" 
                    value="edytuj"
                    type="submit"
                />
                <input 
                    class="excursions__field-input  excursions__field-input--remove" 
                    value="usuń"
                    type="submit"
                />
            </div>
        </form>
    </li>
      `;
}

/*const trip = { name: "wycieczka", about: "blablabla", price: "100PLN" }; */

// 01. create event listener for dodaj
// 02. get data from form inputs
// 03. create an element wycieczka
// 04. add element wycieczka do api excursions
// 05. load element wycieczka

// 06. edit elements
// 07. delete elements
