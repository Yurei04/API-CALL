// Static country-to-code mapping
const countryCodes = {
    "Austria": "AT",
    "Philippines": "PH",
    "Norway": "NO",
    "Belgium": "BE",
    "United States": "US",
    "Germany": "DE",
    "Japan": "JP",
    "Brazil": "BR"
    // Add more as needed
};

const apiURL = 'https://api.worldbank.org/v2/country';
const countryForm = document.getElementById('countryForm');
const countryInput = document.getElementById('countryInput');
const resultDiv = document.getElementById('result');

// Fetch inflation data for the specified country code
async function fetchInflationData(countryCode) {
    try {
        const response = await fetch(`${apiURL}/${countryCode}/indicator/FP.CPI.TOTL?format=json`);
        const data = await response.json();

        // Ensure there is data available
        if (data && data[1] && data[1].length) {
            return data[1][0];  // Get the most recent inflation data entry
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// Display the fetched data in the result div
function displayData(data) {
    if (data) {
        resultDiv.innerHTML = `
            <p><strong>Country:</strong> ${countryInput.value}</p>
            <p><strong>Monthly Rate (%):</strong> ${data.value ? data.value.toFixed(2) : 'N/A'}</p>
            <p><strong>Period:</strong> ${data.date}</p>
            <p><strong>Indicator:</strong> ${data.indicator.value}</p>
        `;
    } else {
        resultDiv.innerHTML = `<p>No data found for the specified country.</p>`;
    }
}

// Handle form submission to fetch and display data
countryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const countryName = countryInput.value.trim();
    const countryCode = countryCodes[countryName];

    if (!countryCode) {
        resultDiv.innerHTML = `<p>Invalid country name. Please try again.</p>`;
        return;
    }

    // Fetch and display data
    const data = await fetchInflationData(countryCode);
    displayData(data);
});
