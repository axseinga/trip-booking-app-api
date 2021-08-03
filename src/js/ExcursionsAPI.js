import "whatwg-fetch";

class ExcursionsAPI {
    // get objects

    getAPI() {
        const API = fetch("http://localhost:3000/excursions");

        return API.then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            return Promise.reject(resp);
        })
            .then((ip) => console.log(ip))
            .catch((err) => console.error(err))
            .finally(() => console.log("Finished"));
    }
    // add object

    addToAPI(trip) {
        const options = {
            method: "POST",
            body: JSON.stringify(trip),
            headers: { "Content-Type": "application/json" },
        };

        const API = fetch(`http://localhost:3000/excursions/`, options);

        return API.then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            return Promise.reject(resp);
        })
            .then((ip) => console.log(ip))
            .catch((err) => console.error(err))
            .finally(() => console.log("Finished"));
    }
    // delete object

    deleteFromAPI(id) {
        // takes string as argument
        const options = {
            method: "DELETE",
        };

        const API = fetch(
            `http://localhost:3000/excursions/${id}`,
            options
        );

        return API.then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            return Promise.reject(resp);
        })
            .then((ip) => console.log(ip))
            .catch((err) => console.error(err))
            .finally(() => console.log("Finished"));
    }
    // edit object
}

export default ExcursionsAPI;
