const form = document.getElementById("stockForm");
const ctx = document.getElementById("stockChart").getContext("2d");

let stockChart;

document.querySelectorAll('.symbol-example').forEach(item => {
    item.style.cursor = "pointer";
    item.addEventListener('click', () => {
        document.getElementById('stockSymbol').value = item.dataset.symbol;
    });
});

async function fetchStockData(symbol) {
    const apiURL = `https://api.api-ninjas.com/v1/stock?symbol=${symbol}`;
    const apiKey = '3q0pCgnHwKYPZXxSSwvrcw==vwparzahmce0WFX4';

    try {
        const response = await fetch(apiURL, {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) throw new Error("Failed to fetch stock data");

        const data = await response.json();
        console.log("Raw Stock Data:", data);

        if (data.length) {
            return {
                open: data[0].open,
                high: data[0].high,
                low: data[0].low,
                close: data[0].close
            };
        } else {
            throw new Error("Data unavailable for this stock symbol");
        }
    } catch (error) {
        console.error("Error fetching stock data:", error.message);
        alert(error.message);
        return null;
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const stockSymbol = document.getElementById("stockSymbol").value.toUpperCase().trim();
    const chartType = document.getElementById("chartType").value;

    const stockData = await fetchStockData(stockSymbol);

    if (stockData) {
        const labels = ["Open", "High", "Low", "Close"];
        const values = [stockData.open, stockData.high, stockData.low, stockData.close];

        // Clear the chart if it already exists
        if (stockChart) {
            stockChart.destroy();
        }

        stockChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: `Stock Prices for ${stockSymbol}`,
                    data: values,
                    backgroundColor: chartType === "pie" ? [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ] : 'rgba(75, 192, 192, 0.2)',
                    borderColor: chartType === "pie" ? [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ] : 'rgba(75, 192, 192, 1)',
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
        console.log("Chart created for stock data.");
    } else {
        console.log("No data available for the entered stock symbol.");
    }
});
