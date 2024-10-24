// Function to load and execute a JavaScript file
function loadAndExecuteScript(fileSrc) {
    var script = document.createElement('script');
    script.src = fileSrc;
    document.body.appendChild(script);
}

// Check local storage initially and on changes
function checkLocalStorage() {
    const isDataSubmit = JSON.parse(localStorage.getItem("is_data_submit"));
    console.log("checkLocalStorage",isDataSubmit)
    if (isDataSubmit) {
        if (isDataSubmit.runScript1) {
            // Load and execute returnImpactCalculator.js
            loadAndExecuteScript("./assets/js/returnImpactCalculator.js");
        }

        if (isDataSubmit.runScript2) {
            // Load and execute returnCalculatorResult.js
            loadAndExecuteScript("./assets/js/returnCalculatorResult.js");
        }
    }
}

// Call checkLocalStorage on page load
checkLocalStorage();

// Listen for changes in local storage
window.addEventListener('storage', function (e) {
    if (e.key === 'is_data_submit') {
        // When local storage is updated, call checkLocalStorage
        checkLocalStorage();
    }
});

// Event listeners for manual script execution
document.getElementById("runScript1Button").addEventListener("click", function () {
    // Update local storage to conditionally execute returnImpactCalculator.js
    const isDataSubmit = JSON.parse(localStorage.getItem("is_data_submit")) || {};
    isDataSubmit.runScript1 = true;
    localStorage.setItem("is_data_submit", JSON.stringify(isDataSubmit));
});

document.getElementById("runScript2Button").addEventListener("click", function () {
    // Update local storage to conditionally execute returnCalculatorResult.js
    const isDataSubmit = JSON.parse(localStorage.getItem("is_data_submit")) || {};
    isDataSubmit.runScript2 = true;
    localStorage.setItem("is_data_submit", JSON.stringify(isDataSubmit));
});