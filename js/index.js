const form = document.getElementById("countryForm");
const ctx = document.getElementById("inflationChart").getContext("2d");
const chartTypeInput = document.getElementById("chartType");
const countryCode = document.getElementById("country").value.toUpperCase().trim();

let inflationChart;
async function obtainData(code) {
    const apiURL = `https://api.api-ninjas.com/v1/inflation?country=${code}`;
    const apiKey = '3q0pCgnHwKYPZXxSSwvrcw==vwparzahmce0WFX4';

    try {
        const response = await fetch(apiURL, {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        console.log(`Fetching data for country code: ${code}`);
        
        if (!response.ok) throw new Error("Failed to fetch data from API");

        const data = await response.json();
        console.log("Raw API response:", data); 

        if (data.length) {
            return data.map(entry => ({
                date: entry.year,
                inflation: entry.inflation_rate
            })).reverse();
        } else {
            throw new Error("Data unavailable for this country or invalid country code");
        }
    } catch (error) {
        console.error("Error in obtainData:", error.message);
        alert(error.message);
        return [];
    }
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();  

    const countryCode = document.getElementById("country").value.toUpperCase().trim();
    const chartType = chartTypeInput.value;

    const inflationData = await obtainData(countryCode);

    if (inflationData.length > 0) {
        const labels = inflationData.map(entry => entry.date);
        const values = inflationData.map(entry => entry.inflation);

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
                plugins: {  
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
