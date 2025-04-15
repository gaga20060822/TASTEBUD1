document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        menuToggle.classList.toggle('active');
        
        const hamburger = document.querySelector('.hamburger');
        const close = document.querySelector('.close');
        
        if (mainNav.classList.contains('active')) {
            hamburger.style.display = 'none';
            close.style.display = 'block';
        } else {
            hamburger.style.display = 'block';
            close.style.display = 'none';
        }
    });
    
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.classList.remove('active');
            document.querySelector('.hamburger').style.display = 'block';
            document.querySelector('.close').style.display = 'none';
        });
    });
});

document.getElementById('backButton').addEventListener('click', function() {
    window.history.back();
});

const saveButton = document.getElementById('saveButton');
const saveIcon = document.getElementById('saveIcon');
const notification = document.getElementById('notification');

let isSaved = localStorage.getItem('savedRecipe') === 'true';

updateSaveButton();

saveButton.addEventListener('click', function() {
    isSaved = !isSaved;
    
    if (isSaved) {
        localStorage.setItem('savedRecipe', 'true');
        showNotification();
    } else {
        localStorage.removeItem('savedRecipe');
    }
    
    updateSaveButton();
});

function updateSaveButton() {
    if (isSaved) {
        saveButton.classList.add('saved');
        saveIcon.textContent = '✓';
        saveButton.innerHTML = `<span id="saveIcon">✓</span> შენახული`;
    } else {
        saveButton.classList.remove('saved');
        saveIcon.textContent = '❤️';
        saveButton.innerHTML = `<span id="saveIcon">❤️</span> შენახვა`;
    }
}

function showNotification() {
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function checkIfRecipeIsSaved() {
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        console.log('კატეგორია:', category);
    }
    
    const sortSelect = document.getElementById('sort');
    const difficultySelect = document.getElementById('difficulty');
    
    if (sortSelect && difficultySelect) {
        sortSelect.addEventListener('change', applyFilters);
        difficultySelect.addEventListener('change', applyFilters);
    }
    
    function applyFilters() {
        const sortBy = sortSelect.value;
        const difficulty = difficultySelect.value;
        
        console.log('დალაგება:', sortBy, 'სირთულე:', difficulty);
    }
    
    const nextPageBtn = document.querySelector('.pagination-button:not(:disabled)');
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            console.log('შემდეგი გვერდი');
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('რეცეპტების სიის გვერდი ჩატვირთულია');
    
    if (window.innerWidth <= 480) {
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromURL = urlParams.get('cat');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    function filterRecipes(category) {
        recipeCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        history.pushState({}, '', `?cat=${category}`);
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            filterRecipes(category);
        });
    });
    
    if (categoryFromURL) {
        filterRecipes(categoryFromURL);
        
        const activeBtn = document.querySelector(`.filter-btn[data-category="${categoryFromURL}"]`);
        if (activeBtn) {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            activeBtn.classList.add('active');
        }
    }
    
    window.addEventListener('popstate', function() {
        const currentParams = new URLSearchParams(window.location.search);
        const currentCategory = currentParams.get('cat') || 'all';
        filterRecipes(currentCategory);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('saveAllBtn').addEventListener('click', function() {
        const currentCategory = document.querySelector('.filter-btn.active').dataset.category;
        const recipesToSave = document.querySelectorAll(`.recipe-card[data-category="${currentCategory}"]:not(.hidden)`);
        
        recipesToSave.forEach(recipe => {
            recipe.classList.add('saved');
            const recipeId = recipe.querySelector('a').href.split('=')[1];
            saveToLocalStorage(recipeId);
        });
        
        showNotification(`შენახულია ${recipesToSave.length} რეცეპტი`);
    });
    
    document.getElementById('quickRecipesBtn').addEventListener('click', function() {
        const allRecipes = document.querySelectorAll('.recipe-card:not(.hidden)');
        
        allRecipes.forEach(recipe => {
            const timeText = recipe.querySelector('.time').textContent;
            const time = parseInt(timeText.match(/\d+/)[0]);
            
            if (time <= 30) {
                recipe.classList.add('quick');
                recipe.querySelector('.time').innerHTML = '⏱️ <strong>'+timeText+'</strong>';
            } else {
                recipe.classList.remove('quick');
                recipe.querySelector('.time').textContent = timeText;
            }
        });
        
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.innerHTML = '<span class="icon">⚡</span> ყველა რეცეპტი';
        } else {
            this.innerHTML = '<span class="icon">⚡</span> სწრაფი რეცეპტები';
            document.querySelectorAll('.recipe-card.quick').forEach(card => {
                card.classList.remove('quick');
            });
        }
    });
    
    document.getElementById('sortSelect').addEventListener('change', function() {
        const sortValue = this.value;
        const recipeContainer = document.querySelector('.recipes-grid');
        const recipes = Array.from(document.querySelectorAll('.recipe-card:not(.hidden)'));
        
        recipes.sort((a, b) => {
            switch(sortValue) {
                case 'time-asc':
                    return getTimeInMinutes(a) - getTimeInMinutes(b);
                case 'time-desc':
                    return getTimeInMinutes(b) - getTimeInMinutes(a);
                case 'difficulty':
                    return getDifficultyValue(a) - getDifficultyValue(b);
                default:
                    return 0;
            }
        });
        
        recipes.forEach(recipe => {
            recipeContainer.appendChild(recipe);
        });
    });
    
    function getTimeInMinutes(recipe) {
        const timeText = recipe.querySelector('.time').textContent;
        return parseInt(timeText.match(/\d+/)[0]);
    }
    
    function getDifficultyValue(recipe) {
        const difficulty = recipe.querySelector('.difficulty').textContent;
        if (difficulty.includes('მარტივი')) return 1;
        if (difficulty.includes('საშუალო')) return 2;
        return 3; 
    }
    
    function saveToLocalStorage(recipeId) {
        let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
        if (!savedRecipes.includes(recipeId)) {
            savedRecipes.push(recipeId);
            localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'temp-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2000);
        }, 100);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm.length < 2) {
            searchResults.innerHTML = '<p class="search-message">გთხოვთ შეიყვანოთ მინიმუმ 2 სიმბოლო</p>';
            return;
        }
        
        const recipeCards = document.querySelectorAll('.recipe-card');
        let foundResults = false;
        
        recipeCards.forEach(card => {
            const title = card.querySelector('.recipe-title').textContent.toLowerCase();
            const description = card.querySelector('.recipe-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                foundResults = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (!foundResults) {
            searchResults.innerHTML = `<p class="search-message">ვერ მოიძებნა "${searchTerm}"-ისთვის. სცადეთ სხვა საკვანძო სიტყვა.</p>`;
        } else {
            searchResults.innerHTML = `<p class="search-message">ნაპოვნია რეცეპტები "${searchTerm}"-ისთვის</p>`;
            window.scrollTo({
                top: searchResults.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }
    
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    searchInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            document.querySelectorAll('.recipe-card').forEach(card => {
                card.style.display = 'block';
            });
            searchResults.innerHTML = '';
        }
    });
});

