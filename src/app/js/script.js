// =========================================================
// ✅ Завдання 1: Оголошення даних та ініціалізація DOM
// =========================================================

const PERSON_NAME = "Іван Петренко";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Ініціалізація імені користувача
    setUserName(PERSON_NAME, 'personName');

    // 2. Ініціалізація обробників подій для кнопок (ЗМЕНШЕНО КІЛЬКІСТЬ ІНІЦІАЛІЗАЦІЙ!)
    initializeRollButtons();

    // 3. Завантаження даних для рендерингу
    getData();
});

function setUserName(name, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = name;
    } else {
        console.error(`Елемент з ID "${elementId}" не знайдено.`);
    }
}

// =========================================================
// ✅ Завдання 2: Логіка розгортання/згортання (Roll Buttons)
// =========================================================

const btnRoll = document.getElementsByClassName("roll");
const blockRoll = document.getElementsByClassName("roll-block");

function initializeRollButtons() {
    Array.from(btnRoll).forEach((btn, index) => {

        btn.innerHTML += ' <span class="toggle-arrow">▼</span>';
        const arrow = btn.querySelector('.toggle-arrow');
        const contentBlock = blockRoll[index];

        // 2. ВСТАНОВЛЕННЯ ПОЧАТКОВОГО СТАНУ (РОЗГОРНУТО)

        // 1. Видаляємо клас прихованості
        contentBlock.classList.remove('hidden');

        // 2. Встановлюємо фактичну висоту для розгорнутого стану.
        // Це необхідно, щоб при першому натисканні на ЗГОРТАННЯ transition спрацював коректно.
        contentBlock.style.maxHeight = contentBlock.scrollHeight + "px";

        // 3. Стрілка ВГОРУ (видаляємо клас 'rotated', який відповідає за стрілку 'вниз')
        if (arrow) {
            arrow.classList.remove('rotated');
        }

        // 3. Додавання слухача події
        btn.addEventListener("click", () => {
            toggleContent(contentBlock, arrow);
        });
    });
}

/**
 * Функція для перемикання стану видимості (тепер починаємо зі стану 'розгорнуто').
 */
function toggleContent(block, arrow) {
    // 💡 Перевіряємо, чи блок ЗАРАЗ РОЗГОРНУТИЙ (тобто, чи немає класу 'hidden')
    if (!block.classList.contains('hidden')) {
        // --- 1. ЛОГІКА ЗГОРТАННЯ (Спрацює при першому натисканні) ---

        // Спочатку встановлюємо висоту, щоб transition спрацював
        block.style.maxHeight = block.scrollHeight + "px";

        // Пауза (10 мс) для застосування стилю перед згортанням
        setTimeout(() => {
             // Повертаємо max-height на 0 і додаємо клас hidden
             block.style.maxHeight = '0';
             block.classList.add('hidden');
        }, 10);

        // Стрілка ВНИЗ
        if (arrow) arrow.classList.add('rotated');

    } else {
        // --- 2. ЛОГІКА РОЗГОРТАННЯ (Спрацює при наступному натисканні) ---

        block.classList.remove('hidden');

        // Встановлюємо фактичну висоту
        block.style.maxHeight = block.scrollHeight + "px";

        // Стрілка ВГОРУ
        if (arrow) arrow.classList.remove('rotated');
    }
}


// =========================================================
// ✅ Завдання 3: Генерація розмітки на основі масиву (RENDER DATA)
// =========================================================

async function getData() {
    try{
        const response = await fetch("http://localhost:8080/data/data.json",{cache:"no-store"});
        if (!response.ok) {
            throw new Error('Помилка при завантаженні даних');
        }
        const json = await response.json();
        renderData(json);
    }catch(error){
        console.error('Помилка під час отримання даних:', error);
    }
}

function renderData(data) {

    // ... (Логіка renderData без змін)

    const about_me_container = document.getElementById("about-me-container");
    const p = document.createElement("p");
    p.classList.add("aboutme_text")
    p.textContent = data.about;
    about_me_container.appendChild(p);

    const education_container = document.getElementById("education-container");
    education_container.innerHTML = ''; // Очищаємо вміст перед вставленням

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
}