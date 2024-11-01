const form = document.getElementById("countryForm");
const ctx = document.getElementById("inflationChart").getContext("2d");
const chartTypeInput = document.getElementById("chartType");

let inflationChart;

async function obtainData(code) {
    const apiURL = `https://api.worldbank.org/v2/country/${code}/indicator/FP.CPI.TOTL.ZG?format=json`;

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

form.addEventListener("submit", async (e) => {
    e.defaultDefault();

    const countryCode = document.getElementById("country").value;
    const chartType = chartTypeInput.value;

    const inflationData = await obtainData(countryCode);

    if(inflationData.length > 0) {
        const labels = inflationData.map(entry => entry.date);
        const values = inflationData.map(entry => entry.inflation);
        // Clearing
        if (inflationChart) {
            inflationChart.destroy();
        }

        inflationChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: `Inflation Data for ${countryCode}`,
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugin: {
                    legend: {
                        display: true,
                        position: "top"
                    }
                }
            }
        });
        console.log("Chart successfully created.");
    } else {
        console.log("No data available for the selected country code.");
    }
});


