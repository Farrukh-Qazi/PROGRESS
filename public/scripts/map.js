var map = L.map('ucdp-map').setView([31.5, 34.47], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const explosionIcon = L.divIcon({
    className: 'explosion-icon',
    html: '<span style="font-size: 24px; color: red;">💥</span>',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const gazaCoordinates = [
    { name: 'Gaza City', lat: 31.5, lon: 34.47 },
    { name: 'Khan Younis', lat: 31.3, lon: 34.28 },
    { name: 'Rafah', lat: 31.26, lon: 34.19 },
    { name: 'Deir al-Balah', lat: 31.37, lon: 34.35 },
    { name: 'Jabalia', lat: 31.5, lon: 34.49 },
    { name: 'Beit Lahia', lat: 31.5, lon: 34.56 },
    { name: 'Shuja’iyya', lat: 31.48, lon: 34.49 },
    { name: 'Nusseirat', lat: 31.34, lon: 34.36 }
];

const israelCoordinates = [
    { name: 'Tel Aviv', lat: 32.07, lon: 34.78 },
    { name: 'Haifa', lat: 32.82, lon: 34.99 },
    { name: 'Ashkelon', lat: 31.67, lon: 34.57 },
    { name: 'Sderot', lat: 31.52, lon: 34.58 },
    { name: 'Kiryat Shmona', lat: 33.21, lon: 35.57 },
    { name: 'Acre', lat: 32.93, lon: 35.08 },
    { name: 'Netanya', lat: 32.33, lon: 34.85 },
    { name: 'Safed', lat: 32.97, lon: 35.54 },
    { name: 'Beersheba', lat: 31.25, lon: 34.79 },
    { name: 'Modi’in-Maccabim-Re’ut', lat: 31.87, lon: 35.01 },
    { name: 'Hadera', lat: 32.44, lon: 34.90 },
    { name: 'Petah Tikva', lat: 32.09, lon: 34.87 },
    { name: 'Rishon LeZion', lat: 31.96, lon: 34.80 },
    { name: 'Ra’anana', lat: 32.17, lon: 34.87 },
    { name: 'Eilat', lat: 29.55, lon: 34.95 }
];

const lebanonCoordinates = [
    { name: 'Beirut', lat: 33.89, lon: 35.51 },
    { name: 'Tripoli', lat: 34.44, lon: 35.85 },
    { name: 'Tyre', lat: 33.17, lon: 35.19 },
    { name: 'Saida', lat: 33.56, lon: 35.37 },
    { name: 'Zahlé', lat: 33.85, lon: 35.86 },
    { name: 'Baalbek', lat: 34.00, lon: 36.20 },
    { name: 'Nabatieh', lat: 30.96, lon: 35.49 },
    { name: 'Marjayoun', lat: 33.26, lon: 35.73 },
    { name: 'Hermel', lat: 34.50, lon: 36.48 },
    { name: 'Aley', lat: 33.80, lon: 35.63 }
];

function addMarkers(coordinates, type) {
    coordinates.forEach(location => {
        const marker = L.marker([location.lat, location.lon], { icon: explosionIcon }).addTo(map);
        marker.bindPopup(`<strong>${location.name}</strong><br>${type} Area`);
    });
}

addMarkers(gazaCoordinates, 'Gaza');
addMarkers(israelCoordinates, 'Israeli');
addMarkers(lebanonCoordinates, 'Lebanese');

const newsApiKey = 'd7aa2f7f203945f3aca3b42febd3117e';
const newsApiUrl = `https://newsapi.org/v2/everything?q=gaza&apiKey=${newsApiKey}`;

async function fetchNews() {
    try {
        const response = await fetch(newsApiUrl);
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-updates');
    newsContainer.innerHTML = '';

    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('news-article');

        articleElement.innerHTML = `
            <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
            <p>${article.description || ''}</p>
            <p><small>Published at: ${new Date(article.publishedAt).toLocaleString()}</small></p>
        `;

        newsContainer.appendChild(articleElement);
    });
}

fetchNews();

const popupButton = document.getElementById('popupButton');
const newsModal = document.getElementById('newsModal');
const closeButton = document.getElementsByClassName('close-button')[0];

popupButton.onclick = function() {
    newsModal.style.display = 'block';
};

closeButton.onclick = function() {
    newsModal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === newsModal) {
        newsModal.style.display = 'none';
    }
};
