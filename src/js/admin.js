import "./../css/admin.css";

import "regenerator-runtime";

import ExcursionsAPI from "./ExcursionsAPI";

//document.addEventListener("DOMContentLoaded", init);

console.log("admin");

init();

function init() {
    // load excursion view for admin
    const manageAPI = new ExcursionsAPI();
    const APIurl = "http://localhost:3000/excursions";
    try {
        const excursions = manageAPI.getAPI(APIurl);
        console.log(excursions);
    } catch (error) {
        console.log(error);
    }
}

function loadAdminView() {}

function createTrip() {
    excursions.forEach((excursion) => {});
}

function createTripMarkup(title, description, adultPrice, childPrice) {
    return `
        <li data-id="1" class="excursions__item     excursions__item--prototype">
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
