document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const resetButton = document.getElementById('resetButton');
    const recommendationsContainer = document.getElementById('recommendations');

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query !== '') {
            fetchRecommendations(query);
        }
    });

    resetButton.addEventListener('click', function() {
        searchInput.value = '';
        recommendationsContainer.innerHTML = ''; // Clear the recommendations
    });
    
    const fetchRecommendations = (query) => {
        fetch('travel_recommendation_api.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                recommendationsContainer.innerHTML = ''; // Clear previous recommendations
                const countries = data.countries;
                const temples = data.temples;
                const beaches = data.beaches;

                const createRecommendationTitleElement = (name) => {
                    const titleElement = document.createElement('h2');
                    titleElement.textContent = name;
                    return titleElement;
                };

                const createRecommendationElement = (name, imageUrl, description) => {
                    const recommendationElement = document.createElement('div');
                    recommendationElement.className = 'recommendation';
                    
                    const imageElement = document.createElement('img');
                    imageElement.src = imageUrl;
                    imageElement.alt = name;

                    const titleElement = document.createElement('h3');
                    titleElement.textContent = name;

                    const descriptionElement = document.createElement('p');
                    descriptionElement.textContent = description;

                    recommendationElement.appendChild(imageElement);
                    recommendationElement.appendChild(titleElement);
                    recommendationElement.appendChild(descriptionElement);

                    return recommendationElement;
                };

                const titleElement = createRecommendationTitleElement('Our Recommendations');
                recommendationsContainer.appendChild(titleElement);

                const searchMatch = (text, query) => {
                    return text.toLowerCase().includes(query.toLowerCase());
                };

                countries.forEach(country => {
                    country.cities.forEach(city => {
                        if (searchMatch(city.name, query) || searchMatch(city.description, query)) {
                            const recommendationElement = createRecommendationElement(city.name, city.imageUrl, city.description);
                            recommendationsContainer.appendChild(recommendationElement);
                        }
                    });
                });

                temples.forEach(temple => {
                    if (searchMatch(temple.name, query) || searchMatch(temple.description, query)) {
                        const recommendationElement = createRecommendationElement(temple.name, temple.imageUrl, temple.description);
                        recommendationsContainer.appendChild(recommendationElement);
                    }
                });

                beaches.forEach(beach => {
                    if (searchMatch(beach.name, query) || searchMatch(beach.description, query)) {
                        const recommendationElement = createRecommendationElement(beach.name, beach.imageUrl, beach.description);
                        recommendationsContainer.appendChild(recommendationElement);
                    }
                });
            })
            .catch(error => console.error('Error loading travel recommendations:', error));
    };
});
