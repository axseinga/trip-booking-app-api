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

    const addBtn = document.querySelector(".order__field-submit");
    addBtn.addEventListener("click", function (e) {
        e.preventDefault();
        addTrip(APIurl, manageAPI);
    });

    // edit & delete trips from the panel //

    const excursionsPanel = document.querySelector(".panel__excursions");
    excursionsPanel.addEventListener("click", function (e) {
        e.preventDefault();
        const target = e.target;
        if (target.tagName === "INPUT") {
            // edit trip
            if (target.classList.contains("excursions__field-input--update")) {
                const displayedTrip =
                    target.parentElement.parentElement.parentElement;
                console.log(displayedTrip);
                markUpdateTrip(displayedTrip);
                deactiveAlltrips();
                const trip = findTriptoUpdate(target, excursions);
                displayTripToUpdate(trip);
                createSaveBtn();
                createCancelBtn();

                // save changes
                const saveBtn = addBtn.nextElementSibling;
                saveBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const id = trip[0].id;
                    const updatedTrip = getTripData();
                    const tripURL = `${APIurl}/${id}`;
                    manageAPI.updateAPI(tripURL, updatedTrip);
                    const markup = createTrip(updatedTrip);
                    displayedTrip.remove();
                    excursionsPanel.insertAdjacentHTML("afterbegin", markup);
                    cancelBtn.remove();
                    saveBtn.remove();
                    addBtn.disabled = false;
                    setDefault();
                    clearInputs();
                });
                // cancel changes
                const cancelBtn = saveBtn.nextElementSibling;
                cancelBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    clearInputs();
                    cancelBtn.remove();
                    saveBtn.remove();
                    addBtn.disabled = false;
                    setDefault();
                });
            } // delete trip
            if (target.classList.contains("excursions__field-input--remove")) {
                deleteTrip(target, manageAPI, APIurl);
            }
        }
    });
}

// Edit any trip from the admin panel //

function markUpdateTrip(displayedTrip) {
    displayedTrip.classList.add("excursions__item--active");
}

function findTriptoUpdate(target, excursions) {
    // 01. find object with matching id
    const parent = target.parentElement.parentElement.parentElement;
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
    saveBtn.value = "save";
    const parentBtns = addBtn.parentElement;
    parentBtns.appendChild(saveBtn);
}

function createCancelBtn() {
    const addBtn = document.querySelector(".order__field-submit");
    const cancelBtn = addBtn.cloneNode();
    cancelBtn.value = "cancel";
    addBtn.disabled = true;
    const parentBtns = addBtn.parentElement;
    parentBtns.appendChild(cancelBtn);
}

// Delete any trip from the panel //

function deleteTrip(target, manageAPI, APIurl) {
    const parent = target.parentElement.parentElement.parentElement;
    const id = parent.dataset.id;
    manageAPI.deleteFromAPI(APIurl, id);
    parent.remove();
}

// Add new trip to the admin panel //

async function addTrip(APIurl, manageAPI) {
    const tripData = getTripData();
    if (tripData) {
        const title = tripData.title;
        // add trip to data.json
        manageAPI.addToAPI(APIurl, tripData);
        // get data from data.json
        let tripDataWithId;
        try {
            tripDataWithId = await manageAPI.getAPI(APIurl);
            // filter for trip with matching id
            console.log(tripDataWithId);
            console.log(title);
            const matchedTrip = tripDataWithId.filter((trip) => {
                return trip.title === title;
            });
            // create element with matching id
            console.log(matchedTrip);
            const markup = createTrip(matchedTrip[0]);
            const excursionsPanel =
                document.querySelector(".panel__excursions");
            excursionsPanel.insertAdjacentHTML("afterbegin", markup);
            clearInputs();
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log("tripData doesnt exist");
    }
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
    const titleEl = document.querySelector(".form__field");
    const title = titleEl.value;
    const descriptionEl = document.querySelector(".form__field--longtext");
    const description = descriptionEl.value;
    const adultPriceEl = document.querySelector("input[name=adult]");
    const adultPrice = adultPriceEl.value;
    const childPriceEl = document.querySelector("input[name=child]");
    const childPrice = childPriceEl.value;

    if (
        title !== "" &&
        description !== "" &&
        adultPrice !== "" &&
        childPrice !== ""
    ) {
        return {
            title: title,
            description: description,
            adultPrice: adultPrice,
            childPrice: childPrice,
        };
    } else {
        titleEl.placeholder = "Add title";
        descriptionEl.placeholder = "Add about";
        adultPriceEl.placeholder = "Add price";
        childPriceEl.placeholder = "Add price";
    }
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
    console.log(excursions);
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
                    Adult: <strong>${adultPrice} </strong>GB
                </label>
            </div>
            <div class="excursions__field">
                <label class="excursions__field-name">
                    Child: <strong>${childPrice} </strong>GB
                </label>
            </div>
            <div class="excursions__field   excursions__field--submit">
                <input 
                    class="excursions__field-input  excursions__field-input--update" 
                    value="edit"
                    type="submit"
                />
                <input 
                    class="excursions__field-input  excursions__field-input--remove" 
                    value="delete"
                    type="submit"
                />
            </div>
        </form>
    </li>
      `;
}

// Clears //

function setDefault() {
    const excursionsPanel = document.querySelector(".panel__excursions");
    const children = excursionsPanel.children;
    console.log(children);

    Array.from(children).forEach((child) => {
        child.classList.remove("excursions__item--not-active");
        child.classList.remove("excursions__item--active");
        toggleInputs(child, false);
    });
}

function deactiveAlltrips() {
    const excursionsPanel = document.querySelector(".panel__excursions");
    const children = excursionsPanel.children;

    Array.from(children).forEach((child) => {
        if (!child.classList.contains("excursions__item--active")) {
            child.classList.add("excursions__item--not-active");
        }
        toggleInputs(child, true);
    });
}

function toggleInputs(input, boolean) {
    const inputEdit = input.lastElementChild.lastElementChild.firstElementChild;
    const inputDelete =
        input.lastElementChild.lastElementChild.lastElementChild;
    inputEdit.disabled = boolean;
    inputDelete.disabled = boolean;
}

function clearInputs() {
    const title = document.querySelector(".form__field");
    title.value = "";
    const description = document.querySelector(".form__field--longtext");
    description.value = "";
    const adultPrice = document.querySelector("input[name=adult]");
    adultPrice.value = "";
    const childPrice = document.querySelector("input[name=child]");
    childPrice.value = "";
}
