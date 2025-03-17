// app.js - Main application logic
// Initialize the modal when app starts
window.addEventListener('DOMContentLoaded', initModal);
// Global variables
let currentData = [];
let categories = [];
let facts = [];
let selectedCategory = 'all';

// DOM elements
const categoryFiltersContainer = document.getElementById('category-filters');
const searchInput = document.getElementById('search-input');
const dishesContainer = document.getElementById('dishes-container');
const rotatingFactsElement = document.getElementById('rotating-facts');

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    // Process the data from the cuisineData variable (from cuisine-data.js)
    processData();
    
    // Set up the UI
    setupCategoryFilters();
    setupFactsRotation();
    
    // Add event listeners
    searchInput.addEventListener('input', filterDishes);
    
    // Initial render
    renderDishes(currentData);
}

function processData() {
    // Process the nested data structure into a flat array for easier rendering
    currentData = [];
    categories = [];
    facts = [];
    
    // Process each category
    for (const categoryKey in cuisineData) {
        // Extract category name without the number prefix
        const categoryNameParts = categoryKey.split(' ');
        const categoryId = categoryNameParts[0]; // e.g., "1.1"
        const categoryName = categoryNameParts.slice(1).join(' '); // e.g., "Sushi & Sashimi"
        
        // Add to categories array
        if (!categories.includes(categoryKey)) {
            categories.push(categoryKey);
        }
        
        const category = cuisineData[categoryKey];
        for (const subcategoryKey in category) {
            const subcategory = category[subcategoryKey];
            
            // Handle subcategory items
            for (const dishKey in subcategory) {
                const dish = subcategory[dishKey];
                
                // Check if it has information object
                if (dish.information) {
                    const dishInfo = {
                        id: `${categoryKey}-${subcategoryKey}-${dishKey}`,
                        category: categoryKey,
                        subcategory: subcategoryKey,
                        name: dishKey,
                        ...dish.information
                    };
                    
                    // Add to flat array
                    currentData.push(dishInfo);
                    
                    // Collect fun facts
                    if (dish.information.funFacts && dish.information.funFacts.length > 0) {
                        dish.information.funFacts.forEach(fact => {
                            facts.push({
                                dish: dish.information.englishName,
                                fact: fact
                            });
                        });
                    }
                } else if (typeof dish === 'object' && Object.keys(dish).length === 0) {
                    // Handle empty objects (dishes without information)
                    const dishInfo = {
                        id: `${categoryKey}-${subcategoryKey}-${dishKey}`,
                        category: categoryKey,
                        subcategory: subcategoryKey,
                        name: dishKey,
                        englishName: dishKey,
                        description: `A type of ${categoryKey} in Japanese cuisine.`
                    };
                    
                    // Add to flat array
                    currentData.push(dishInfo);
                }
            }
        }
    }
    
    console.log("Processed data:", currentData);
    console.log("Categories:", categories);
}

function setupCategoryFilters() {
    // Clear existing filters
    categoryFiltersContainer.innerHTML = '';
    
    // Add "All" category
    const allFilter = document.createElement('button');
    allFilter.className = 'category-filter active';
    allFilter.textContent = 'All';
    allFilter.dataset.category = 'all';
    allFilter.addEventListener('click', () => selectCategory('all'));
    categoryFiltersContainer.appendChild(allFilter);
    
    // Get the unique list of categories that actually exist in data
    const availableCategories = [...new Set(currentData.map(dish => dish.category))];
    
    // Add category filters only for categories that exist in data
    availableCategories.sort().forEach(category => {
        // Extract the category name without the number prefix
        const displayName = category.split(' ').slice(1).join(' '); // Remove the "1.1" part
        
        const filterButton = document.createElement('button');
        filterButton.className = 'category-filter';
        filterButton.textContent = displayName; // Use display name without numbers
        filterButton.dataset.category = category; // Keep original category value for filtering
        filterButton.addEventListener('click', () => selectCategory(category));
        categoryFiltersContainer.appendChild(filterButton);
    });
}
function selectCategory(category) {
    // Update active state
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // Update selected category and filter dishes
    selectedCategory = category;
    filterDishes();
}

function filterDishes() {
    console.log("Filtering by category:", selectedCategory);
    console.log("Available categories in data:", 
        [...new Set(currentData.map(dish => dish.category))]);

    const searchTerm = searchInput.value.toLowerCase();
    
    // First filter by category
    let filteredDishes = currentData;
    if (selectedCategory !== 'all') {
        filteredDishes = currentData.filter(dish => dish.category === selectedCategory);
    }
    
    // Then filter by search term
    if (searchTerm) {
        filteredDishes = filteredDishes.filter(dish => 
            dish.englishName.toLowerCase().includes(searchTerm) ||
            (dish.japaneseName && dish.japaneseName.toLowerCase().includes(searchTerm)) ||
            (dish.description && dish.description.toLowerCase().includes(searchTerm))
        );
    }
    
    renderDishes(filteredDishes);
}

function openDishDetail(dish) {
    const modal = document.getElementById('dish-detail-modal');
    
    // Set the image
    const dishName = dish.name || '';
    const imageFilename = dishName.replace(/\s+/g, '-') + '.jpg';
    const imagePath = `images_v2/images/${imageFilename}`;
    
    document.getElementById('modal-dish-image').src = imagePath;
    document.getElementById('modal-dish-image').alt = dish.englishName;
    
    // Set text content
    document.getElementById('modal-dish-title').textContent = dish.englishName;
    document.getElementById('modal-dish-japanese').textContent = dish.japaneseName || '';
    document.getElementById('modal-dish-description').textContent = dish.description || 'No description available.';
    document.getElementById('modal-dish-history').textContent = dish.briefHistory || 'No historical information available.';
    
    // Format the area of origin
    const origin = dish.areaOfOrigin || '';
    const formattedOrigin = origin.startsWith('JP-') ? 
      `Japan (Prefecture code: ${origin})` : origin;
    document.getElementById('modal-dish-origin').textContent = formattedOrigin || 'Origin information not available.';
    
    // Add fun facts
    const factsList = document.getElementById('modal-dish-facts');
    factsList.innerHTML = '';
    if (dish.funFacts && dish.funFacts.length > 0) {
      dish.funFacts.forEach(fact => {
        const li = document.createElement('li');
        li.textContent = fact;
        factsList.appendChild(li);
      });
    } else {
      factsList.innerHTML = '<li>No fun facts available.</li>';
    }
    
    // Add variations
    const variationsList = document.getElementById('modal-dish-variations');
    variationsList.innerHTML = '';
    if (dish.variations && dish.variations.length > 0) {
      dish.variations.forEach(variation => {
        const li = document.createElement('li');
        li.textContent = variation;
        variationsList.appendChild(li);
      });
    } else {
      variationsList.innerHTML = '<li>No variations available.</li>';
    }
    
    // Add ingredients
    const ingredientsList = document.getElementById('modal-dish-ingredients');
    ingredientsList.innerHTML = '';
    if (dish.ingredients && dish.ingredients.length > 0) {
      dish.ingredients.forEach(ing => {
        const li = document.createElement('li');
        // Format as "Ingredient (XX%)"
        const percentage = ing.ratio ? ` (${Math.round(ing.ratio * 100)}%)` : '';
        li.textContent = `${ing.ingredient}${percentage}`;
        ingredientsList.appendChild(li);
      });
    } else {
      ingredientsList.innerHTML = '<li>No ingredient information available.</li>';
    }
    
    // Show the modal
    modal.style.display = "block";
  }



function renderDishes(dishes) {
    // Clear the container
    dishesContainer.innerHTML = '';
    
    // If no dishes match, show a message
    if (dishes.length === 0) {
        dishesContainer.innerHTML = '<p>No dishes found matching your search.</p>';
        return;
    }
    
    // Render each dish
    dishes.forEach(dish => {
        const card = document.createElement('div');
        card.className = 'dish-card';
        
        // Make card clickable
        card.style.cursor = 'pointer';
        card.onclick = function() {
            openDishDetail(dish);
        };
        
        // Extract the dish name from data
        const dishName = dish.name || '';
        
        // Format the filename
        const imageFilename = dishName.replace(/\s+/g, '-') + '.jpg';
        const imagePath = `images_v2/images/${imageFilename}`;
        
        // Build card HTML
        card.innerHTML = `
            <div class="dish-image-container">
                <img src="${imagePath}" alt="${dish.englishName}" class="dish-image" 
                     onerror="this.style.display='none'; this.parentElement.style.backgroundColor='#f0f0f0';">
            </div>
            <div class="dish-content">
                <h3 class="dish-title">${dish.englishName}</h3>
                <div class="dish-japanese">${dish.japaneseName || ''}</div>
                <p class="dish-description">${dish.description || 'No description available.'}</p>
                ${dish.variations ? `<div class="dish-variation">with variations like ${dish.variations[0]}</div>` : ''}
            </div>
        `;
        
        dishesContainer.appendChild(card);
    });
}
function setupFactsRotation() {
    // If no facts were found, add some defaults
    if (facts.length === 0) {
        facts = [
            { dish: "Japanese Cuisine", fact: "Japanese cuisine is known for its emphasis on seasonality and quality ingredients." },
            { dish: "Sushi", fact: "Contrary to popular belief, sushi refers to the vinegared rice, not the raw fish." },
            { dish: "Ramen", fact: "Ramen was originally imported from China and has evolved into diverse regional styles across Japan." }
        ];
    }
    
    // Display a random fact initially
    displayRandomFact();
    
    // Set up interval to rotate facts
    setInterval(displayRandomFact, 10000);
}

function displayRandomFact() {
    const randomIndex = Math.floor(Math.random() * facts.length);
    const factObj = facts[randomIndex];
    
    // Create the fact text with a clickable link
    rotatingFactsElement.innerHTML = `"${factObj.fact}" —<a href="#" class="fact-dish-link" data-dish="${factObj.dish}">${factObj.dish}</a>`;
    
    // Add click handler to the link
    document.querySelector('.fact-dish-link').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Find the dish object by name
        const dishName = this.getAttribute('data-dish');
        const dishObject = currentData.find(dish => dish.englishName === dishName);
        
        // Open the modal if dish is found
        if (dishObject) {
            openDishDetail(dishObject);
        }
    });
}
