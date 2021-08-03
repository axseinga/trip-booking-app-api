import "regenerator-runtime";
import "whatwg-fetch";

class ExcursionsAPI {
    // get objects
    getAPI(APIurl) {
        const API = fetch(APIurl);

        return API.then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            return Promise.reject(resp);
        })
            .then((ip) => {
                console.log(ip);
                const excursions = ip;
                return excursions;
            })
            .catch((err) => console.error(err))
            .finally(() => console.log("Finished"));
    }

    // add object
    addToAPI(APIurl, trip) {
        const options = {
            method: "POST",
            body: JSON.stringify(trip),
            headers: { "Content-Type": "application/json" },
        };

        const API = fetch(APIurl, options);

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
    deleteFromAPI(APIurl, id) {
        // takes string as argument
        const options = {
            method: "DELETE",
        };

        const API = fetch(`${APIurl}/${id}`, options);

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
