// First, add this HTML for the popup modal at the end of your body tag
function addModalToDOM() {
    const modalHtml = `
      <div id="dish-detail-modal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <div class="modal-body">
            <div class="modal-header">
              <h2 id="modal-dish-title"></h2>
              <h3 id="modal-dish-japanese"></h3>
            </div>
            <div class="modal-image-container">
              <img id="modal-dish-image" src="" alt="">
            </div>
            <div class="modal-description">
              <p id="modal-dish-description"></p>
            </div>
            <div class="modal-sections">
              <div class="modal-section">
                <h4>History</h4>
                <p id="modal-dish-history"></p>
              </div>
              <div class="modal-section">
                <h4>Origin</h4>
                <p id="modal-dish-origin"></p>
              </div>
              <div class="modal-section">
                <h4>Fun Facts</h4>
                <ul id="modal-dish-facts"></ul>
              </div>
              <div class="modal-section">
                <h4>Variations</h4>
                <ul id="modal-dish-variations"></ul>
              </div>
              <div class="modal-section">
                <h4>Ingredients</h4>
                <ul id="modal-dish-ingredients"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
  
  // Add CSS for the modal
  function addModalStyles() {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.6);
      }
      
      .modal-content {
        background-color: #fefefe;
        margin: 5% auto;
        padding: 20px;
        border-radius: 12px;
        width: 80%;
        max-width: 800px;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        animation: modalFadeIn 0.3s;
      }
      
      @keyframes modalFadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .close-modal {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
      }
      
      .close-modal:hover {
        color: #555;
      }
      
      .modal-header {
        margin-bottom: 15px;
      }
      
      .modal-header h2 {
        margin-bottom: 5px;
        color: #333;
      }
      
      .modal-header h3 {
        margin-top: 0;
        color: #666;
        font-weight: normal;
      }
      
      .modal-image-container {
        width: 100%;
        height: 300px;
        margin-bottom: 20px;
        border-radius: 8px;
        overflow: hidden;
        background-color: #f0f0f0;
      }
      
      .modal-image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .modal-description {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 20px;
        color: #333;
      }
      
      .modal-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .modal-section {
        margin-bottom: 20px;
      }
      
      .modal-section h4 {
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #eee;
        color: #444;
      }
      
      .modal-section ul {
        padding-left: 20px;
      }
      
      .modal-section li {
        margin-bottom: 8px;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(styleSheet);
  }
  
  // Initialize the modal
  function initModal() {
    addModalToDOM();
    addModalStyles();
    
    // Add close handler for the modal
    const modal = document.getElementById('dish-detail-modal');
    const closeBtn = modal.querySelector('.close-modal');
    
    closeBtn.onclick = function() {
      modal.style.display = "none";
    }
    
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }
  }
  
  // Update the renderDishes function to make cards clickable
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
      
      // Format image path as before
      const dishName = dish.name || '';
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
  
  // Function to open the detail modal for a dish
  
  // Call this during initialization
  document.addEventListener('DOMContentLoaded', function() {
    // Other initialization code...
    initModal();
  });
