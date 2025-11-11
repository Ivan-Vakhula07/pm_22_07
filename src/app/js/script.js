const btnRoll = document.getElementsByClassName("roll");
const blockRoll = document.getElementsByClassName("roll-block");

// =========================================================
// ✅ НОВА ЛОГІКА: Ініціалізація стрілок та прив'язка обробників
// =========================================================

Array.from(btnRoll).forEach((btn, index) => {
    // 1. Додавання стрілки до заголовка
    btn.innerHTML += ' <span class="toggle-arrow">▼</span>';
    const arrow = btn.querySelector('.toggle-arrow');

    // 2. Встановлення початкового стану (Згорнуто)
    // У вашому підході початковий стан задається стилями CSS (max-height: 0)
    if (arrow) {
        // Ми припускаємо, що у CSS клас .toggle-arrow.rotated обертає стрілку
        arrow.classList.add('rotated');
    }

    // 3. Додавання слухача події
    btn.addEventListener("click", () => {
        showOrHide(blockRoll[index], arrow);
    });
});

// =========================================================
// ✅ ОНОВЛЕНА ФУНКЦІЯ: Розгортання/згортання та обертання стрілки
// =========================================================

/**
 * Функція для розгортання/згортання блоку та зміни піктограми.
 * @param {HTMLElement} block - Блок контенту.
 * @param {HTMLElement} arrow - Елемент стрілки.
 */
function showOrHide(block, arrow) {
    if (block.style.maxHeight && block.style.maxHeight !== "0px") {
        block.style.maxHeight = "0"; // Згорнути
        if (arrow) arrow.classList.add('rotated'); // Обернути стрілку вниз/назад
    } else {
        block.style.maxHeight = block.scrollHeight + "px"; // Розгорнути до висоти контенту
        if (arrow) arrow.classList.remove('rotated'); // Обернути стрілку вгору/вперед
    }
}

// =========================================================
// ЛОГІКА FETCH API ТА RENDER (залишена без змін, крім назви аргументу)
// =========================================================

// Fetch API reqпний
async function getData() {
    try{
        // Припускаємо, що server (localhost:8080) досту
        const response = await fetch("http://localhost:8080/data/data.json",{cache:"no-store"});
        if (!response.ok) {
            throw new Error('Помилка при завантаженні даних');
        }
        const json = await response.json();
        // Рендеринг даних
        renderData(json);
    }catch(error){
        console.error('Помилка під час отримання даних:', error);
    }
}

// Виклик завантаження даних
getData();

// Show data on page
function renderData(data) {

    const about_me_container = document.getElementById("about-me-container");

    // Припускаємо, що data.about містить текст про мене
    const p = document.createElement("p");
    p.classList.add("aboutme_text")
    p.textContent = data.about;
    about_me_container.appendChild(p);

    const education_container = document.getElementById("education-container");
    data.education.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("education_card");

        const h4 = document.createElement("h4");
        h4.classList.add("education_card__title");
        h4.textContent = item.major_name;
        div.appendChild(h4);

        const p = document.createElement("p");
        p.classList.add("education_card__text");
        p.textContent = item.major_info;
        div.appendChild(p);

        education_container.appendChild(div);
    })
    // NOTE: Тут не вистачає логіки для секції Experience,
    // якщо ви її також завантажуєте з JSON, її потрібно додати сюди!
}