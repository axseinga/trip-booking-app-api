import "./../css/admin.css";

import "regenerator-runtime";
import "whatwg-fetch";

import ExcursionsAPI from "./ExcursionsAPI";

document.addEventListener("DOMContentLoaded", init);

console.log("admin");

async function init() {
    // load excursion view for admin
    let excursions;
    const manageAPI = new ExcursionsAPI();
    const APIurl = "http://localhost:3000/excursions";
    try {
        excursions = await manageAPI.getAPI(APIurl);
        console.log(excursions);
        const markups = createTrips(excursions);
        loadTrips(markups);
    } catch (error) {
        console.log(error);
    }
    // add new trip to the panel //
    /* enable adding empty trips! */
    /* clear inputs */

    const addBtn = document.querySelector(".order__field-submit");
    addBtn.addEventListener("click", function (e) {
        e.preventDefault();
        addTrip(APIurl, manageAPI);
    });

    // delete trips from the panel //
    const deleteBtns = Array.from(
        document.querySelectorAll(".excursions__field-input--remove")
    );
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            deleteTrip(btn, manageAPI, APIurl);
        });
    });

    // edit trips from the panel //
    const editBtns = Array.from(
        document.querySelectorAll(".excursions__field-input--update")
    );
    editBtns.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const displayedTrip =
                e.target.parentElement.parentElement.parentElement;
            console.log(displayedTrip);
            const trip = findTriptoUpdate(btn, excursions);
            displayTripToUpdate(trip);
            createSaveBtn();
            const saveBtn = addBtn.nextElementSibling;
            saveBtn.addEventListener("click", function (e) {
                e.preventDefault();
                // remove updated trip from data.json and display
                const id = trip[0].id;
                manageAPI.deleteFromAPI(APIurl, id);
                displayedTrip.remove();
                // get data from inputs
                addTrip(APIurl, manageAPI);
            });
        });
    });
}

// Edit any trip from the panel //

// 03. po kliknieciu zapisz obiekt z inputu zastepuje obiekt ktory mial byc zedytowant
// 04. API usuwa obiekt i dodaje nowy.

function findTriptoUpdate(btn, excursions) {
    // 01. find object with matching id
    const parent = btn.parentElement.parentElement.parentElement;
    const id = parent.dataset.id;
    const trip = excursions.filter((trip) => {
        return trip.id === +id;
    });
    return trip;
}

function displayTripToUpdate(trip) {
    // 02. fill in inputs with object data
    const title = document.querySelector(".form__field");
    title.value = trip[0].title;
    const description = document.querySelector(".form__field--longtext");
    description.value = trip[0].description;
    const adultPrice = document.querySelector("input[name=adult]");
    adultPrice.value = trip[0].adultPrice;
    const childPrice = document.querySelector("input[name=child]");
    childPrice.value = trip[0].childPrice;
}

function createSaveBtn() {
    // 02. create save button and disable add button
    const addBtn = document.querySelector(".order__field-submit");
    const saveBtn = addBtn.cloneNode();
    saveBtn.value = "zapisz";
    addBtn.disabled = true;
    const parentBtns = addBtn.parentElement;
    parentBtns.appendChild(saveBtn);
}

// Delete any trip from the panel //

function deleteTrip(btn, manageAPI, APIurl) {
    const parent = btn.parentElement.parentElement.parentElement;
    const id = parent.dataset.id;
    manageAPI.deleteFromAPI(APIurl, id);
    parent.remove();
}

// Add new trip to the admin panel //

async function addTrip(APIurl, manageAPI) {
    const tripData = getTripData();
    const title = tripData.title;
    // add trip to data.json
    manageAPI.addToAPI(APIurl, tripData);
    // get data from data.json
    let tripDataWithId;
    try {
        tripDataWithId = await manageAPI.getAPI(APIurl);
    } catch (err) {
        console.log(err);
    }
    // filter for trip with matching id
    const matchedTrip = tripDataWithId.filter((trip) => {
        return trip.title === title;
    });
    // create element with matching id
    const markup = createTrip(matchedTrip[0]);
    const excursionsPanel = document.querySelector(".panel__excursions");
    excursionsPanel.insertAdjacentHTML("afterbegin", markup);
}

function createTrip(tripData) {
    const id = tripData.id;
    const title = tripData.title;
    const description = tripData.description;
    const adultPrice = tripData.adultPrice;
    const childPrice = tripData.childPrice;
    const markup = createTripsMarkup(
        id,
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
        const id = excursion.id;
        const title = excursion.title;
        const description = excursion.description;
        const adultPrice = excursion.adultPrice;
        const childPrice = excursion.childPrice;
        const markup = createTripsMarkup(
            id,
            title,
            description,
            adultPrice,
            childPrice
        );
        markups.push(markup);
    });
    return markups;
}

function createTripsMarkup(id, title, description, adultPrice, childPrice) {
    return `
        <li data-id="${id}" class="excursions__item">
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
