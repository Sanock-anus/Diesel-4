document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const logoutButton = document.getElementById('logoutButton');
    const userNameDisplay = document.getElementById('userName');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginSubmitButton = document.getElementById('loginSubmit');
    const registerSubmitButton = document.getElementById('registerSubmit');
    const closeButtons = document.querySelectorAll('.close');
    const gameListContainer = document.querySelector('.game-list');
    const filterButton = document.getElementById('filterButton');
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
    let loggedInUser = localStorage.getItem('loggedInUser');

    // Модальные окна
    loginButton.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    registerButton.addEventListener('click', () => {
        registerModal.style.display = 'block';
    });
    
     closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
    // Авторизация и регистрация

    loginSubmitButton.addEventListener('click', () => {
        const loginUsername = document.getElementById('loginUsername').value;
        const loginPassword = document.getElementById('loginPassword').value;
        
         const storedUsers = JSON.parse(localStorage.getItem('users')) || {};

        if(storedUsers[loginUsername] && storedUsers[loginUsername].password === loginPassword){
             localStorage.setItem('loggedInUser', loginUsername);
             updateUIForLogin(loginUsername);
             loginModal.style.display = 'none';
            
        } else{
            alert("Неверный логин или пароль.");
        }
        
    });
    
        registerSubmitButton.addEventListener('click', () => {
        const registerUsername = document.getElementById('registerUsername').value;
        const registerPassword = document.getElementById('registerPassword').value;
           
            const storedUsers = JSON.parse(localStorage.getItem('users')) || {};
            if (storedUsers[registerUsername]) {
                 alert("Пользователь с таким именем уже существует.");
                return;
            }
           storedUsers[registerUsername] = {
             password: registerPassword
        };
        localStorage.setItem('users', JSON.stringify(storedUsers));

        alert('Регистрация прошла успешно!');
            registerModal.style.display = 'none';
           
        
        
    });

        // Выход пользователя
    logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            loggedInUser = null;
             updateUIForLogout();
        });
        
    if (loggedInUser) {
          updateUIForLogin(loggedInUser);
    } else {
          updateUIForLogout();
    }

       function updateUIForLogin(username) {
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        userNameDisplay.textContent = `Привет, ${username}!`;
        userNameDisplay.style.display = 'inline-block';
        loadAndDisplayGames();
     
    }
    
    function updateUIForLogout(){
          loginButton.style.display = 'inline-block';
        registerButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
         userNameDisplay.style.display = 'none';
        userNameDisplay.textContent = '';
         gameListContainer.innerHTML = '';
    }
    
      function loadAndDisplayGames() {
           const games = JSON.parse(localStorage.getItem('games')) || [];
          displayGames(games)
      }
      function displayGames(games){
           gameListContainer.innerHTML = '';
            games.forEach((game, index) => {
             const gameCard = document.createElement('div');
                gameCard.classList.add('game-card');
                gameCard.innerHTML = `
                    <img src="" alt="${game.title}">
                    <h3>${game.title}</h3>
                    <p>${game.description}</p>
                    <div class="price">$${game.price}</div>
                     <button class="download-button" data-index="${index}">Загрузить</button>
                    `;
                    gameListContainer.appendChild(gameCard);
                })
              setupDownloadButtons();
      }

    //Фильтры
    filterButton.addEventListener('click', () => {
        const selectedGenres = Array.from(filterCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.dataset.genre);

        const games = JSON.parse(localStorage.getItem('games')) || [];
        const filteredGames = selectedGenres.length > 0
            ? games.filter(game => selectedGenres.includes(game.genre))
            : games;
        displayGames(filteredGames);
    });
    
    // Игры
    function setupDownloadButtons() {
        document.querySelectorAll('.download-button').forEach(button => {
            button.addEventListener('click', function() {
               const gameIndex = this.dataset.index;
               const games = JSON.parse(localStorage.getItem('games')) || [];
             
              if(games[gameIndex]){
                  alert(`Игра ${games[gameIndex].title} загружается..`)
              }
            });
        });
    }

    // Добавляем игры
    if (loggedInUser){
        let games = JSON.parse(localStorage.getItem('games')) || [];
         if (games.length === 0){
          games = [
                {
                  title: "Игра 1",
                  description: "Краткое описание игры 1...",
                  price: 19.99,
                  image: "game1.jpg",
                  genre: "action"
              },
              {
                  title: "Игра 2",
                  description: "Краткое описание игры 2...",
                  price: 29.99,
                  image: "game2.jpg",
                  genre: "rpg"
              },
                {
                    title: "Игра 3",
                    description: "Краткое описание игры 3...",
                    price: 39.99,
                    image: "game3.jpg",
                   genre: "strategy"
                },
                {
                  title: "Игра 4",
                  description: "Краткое описание игры 4...",
                  price: 49.99,
                  image: "game4.jpg",
                   genre: "indie"
              },
          ];
            localStorage.setItem('games', JSON.stringify(games));
           loadAndDisplayGames();
         }else{
             loadAndDisplayGames();
         }
       
    }
});
