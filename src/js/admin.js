import "./../css/admin.css";

import "whatwg-fetch";

import ExcursionsAPI from "./ExcursionsAPI";

//document.addEventListener("DOMContentLoaded", init);

console.log("admin");

init();

async function init() {
    // load excursion view for admin
    const manageAPI = new ExcursionsAPI();
    try {
        const excursions = await manageAPI.getAPI();
        console.log(excursions);
    } catch (error) {
        console.log(error);
    }
}

function loadAdminView() {}

/*const trip = { name: "wycieczka", about: "blablabla", price: "100PLN" }; */

// 01. create event listener for dodaj
// 02. get data from form inputs
// 03. create an element wycieczka
// 04. add element wycieczka do api excursions
// 05. load element wycieczka

// 06. edit elements
// 07. delete elements
