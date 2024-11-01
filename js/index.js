const form = document.getElementById("countryForm");
const ctx = document.getElementById("inflationChart").getContext("2d");

let inflationChart;

async function obtainData(code) {
    const apiURL = ``;

    try {
        const response = await fetch(apiURL);
        if(!response.ok) throw new Error()

        const data = await response.json();

        if(data[1]) {
            return data[1].map(entry => ({
                date: entry.date,
                inflation: entry.value
            })).reverse();
        
        } else {
            throw new Error("Data Unavailable for this country");
        }
    } catch (error) {
        alert(error.message);
        return [];
    }
}


