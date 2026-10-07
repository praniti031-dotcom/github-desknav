// GitHub DeskNav


// Prevent duplicate navigation bar
if (!document.getElementById("desk-nav")) {

    // Create navigation bar
    const nav = document.createElement("div");

    nav.id = "desk-nav";

    nav.innerHTML = `
        <button id="desk-back" title="Go Back">←</button>
        <button id="desk-forward" title="Go Forward">→</button>
        <button id="desk-home" title="GitHub Home">⌂</button>
        <button id="desk-recent" title="Recent Pages">▣</button>
        <button id="desk-journey" title="Browsing Journey">🧭</button>
    `;

    document.body.appendChild(nav);

    // Back button
    document.getElementById("desk-back").addEventListener("click", function () {
        history.back();
    });

    // Forward button
    document.getElementById("desk-forward").addEventListener("click", function () {
        history.forward();
    });

    // Home button
    document.getElementById("desk-home").addEventListener("click", function () {
        window.location.href = "https://github.com/";
    });

    // Save current page
    function saveCurrentPage() {

        const page = {
            title: document.title || "GitHub Page",
            url: window.location.href,
            time: new Date().toLocaleTimeString()
        };

        chrome.storage.local.get(
            {
                recentPages: [],
                journey: []
            },

            function (result) {

                let recentPages = result.recentPages;
                let journey = result.journey;


                if (!Array.isArray(recentPages)) {
                    recentPages = [];
                }

                if (!Array.isArray(journey)) {
                    journey = [];
                }

                // Update Recent Pages
                recentPages = recentPages.filter(function (item) {
                    return item.url !== page.url;
                });

                recentPages.unshift(page);

                recentPages = recentPages.slice(0, 10);

                // Update Journey
                if (
                    journey.length === 0 ||
                    journey[journey.length - 1].url !== page.url
                ) {
                    journey.push(page);
                }

                journey = journey.slice(-20);

                // Save
                chrome.storage.local.set({
                    recentPages: recentPages,
                    journey: journey
                });

            }
        );

    }

    // Save current page
    saveCurrentPage();

    // Recent Pages Panel

    const recentPanel = document.createElement("div");

    recentPanel.id = "recent-panel";

    recentPanel.innerHTML = `
        <div class="recent-header">
            <span>Recent GitHub Pages</span>
            <button id="close-recent" title="Close">×</button>
        </div>

        <div id="recent-list">
            <p class="empty-message">No recent pages yet.</p>
        </div>

        <div class="recent-footer">
            <button id="clear-recent">Clear All</button>
        </div>
    `;

    document.body.appendChild(recentPanel);


    // Recent button
    document.getElementById("desk-recent").addEventListener("click", function () {

        loadRecentPages();

        recentPanel.classList.add("show");

    });


    // Close Recent
    document.getElementById("close-recent").addEventListener("click", function () {

        recentPanel.classList.remove("show");

    });


    // Load Recent Pages
    function loadRecentPages() {

        chrome.storage.local.get(
            { recentPages: [] },

            function (result) {

                const list = document.getElementById("recent-list");

                list.innerHTML = "";


                if (
                    !Array.isArray(result.recentPages) ||
                    result.recentPages.length === 0
                ) {

                    list.innerHTML = `
                        <p class="empty-message">
                            No recent pages yet.
                        </p>
                    `;

                    return;
                }


                result.recentPages.forEach(function (page) {

                    const item = document.createElement("div");

                    item.className = "recent-item";


                    const title = document.createElement("div");

                    title.className = "recent-title";

                    title.textContent = page.title;


                    const url = document.createElement("div");

                    url.className = "recent-url";

                    url.textContent = page.url;


                    item.appendChild(title);

                    item.appendChild(url);


                    item.addEventListener("click", function () {

                        window.location.href = page.url;

                    });


                    list.appendChild(item);

                });

            }
        );

    }


    // Clear Recent Pages
    document.getElementById("clear-recent").addEventListener("click", function () {

        chrome.storage.local.set(
            { recentPages: [] },

            function () {

                loadRecentPages();

                console.log("DeskNav: Recent pages cleared.");

            }
        );

    });

    // Browsing Journey Panel

    const journeyPanel = document.createElement("div");

    journeyPanel.id = "journey-panel";

    journeyPanel.innerHTML = `
        <div class="journey-header">
            <span>🧭 Browsing Journey</span>
            <button id="close-journey" title="Close">×</button>
        </div>

        <div id="journey-list">
            <p class="empty-message">No journey yet.</p>
        </div>

        <div class="journey-footer">
            <button id="clear-journey">Clear Journey</button>
        </div>
    `;

    document.body.appendChild(journeyPanel);


    // Journey button
    document.getElementById("desk-journey").addEventListener("click", function () {

        loadJourney();

        journeyPanel.classList.add("show");

    });


    // Close Journey
    document.getElementById("close-journey").addEventListener("click", function () {

        journeyPanel.classList.remove("show");

    });


    // Load Journey
    function loadJourney() {

        chrome.storage.local.get(
            { journey: [] },

            function (result) {

                const list = document.getElementById("journey-list");

                list.innerHTML = "";


                if (
                    !Array.isArray(result.journey) ||
                    result.journey.length === 0
                ) {

                    list.innerHTML = `
                        <p class="empty-message">
                            No journey yet.
                        </p>
                    `;

                    return;
                }


                result.journey.forEach(function (page, index) {

                    const item = document.createElement("div");

                    item.className = "journey-item";


                    const number = document.createElement("div");

                    number.className = "journey-number";

                    number.textContent = index + 1;


                    const info = document.createElement("div");

                    info.className = "journey-info";


                    const title = document.createElement("div");

                    title.className = "journey-title";

                    title.textContent = page.title;


                    const time = document.createElement("div");

                    time.className = "journey-time";

                    time.textContent = page.time || "";


                    info.appendChild(title);

                    info.appendChild(time);


                    item.appendChild(number);

                    item.appendChild(info);


                    item.addEventListener("click", function () {

                        window.location.href = page.url;

                    });


                    list.appendChild(item);

                });

            }
        );

    }


    // Clear Journey
    document.getElementById("clear-journey").addEventListener("click", function () {

        chrome.storage.local.set(
            { journey: [] },

            function () {

                loadJourney();

                console.log("DeskNav: Journey cleared.");

            }
        );

    });

    // Detect GitHub page changes

    let lastURL = window.location.href;


    setInterval(function () {

        const currentURL = window.location.href;


        if (currentURL !== lastURL) {

            lastURL = currentURL;

            saveCurrentPage();

            console.log("DeskNav: New page detected.");

        }

    }, 500);


    console.log("GitHub DeskNav loaded successfully.");

}