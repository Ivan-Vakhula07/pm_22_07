// ----------------------------------------
// ЛОГІКА AJAX / FETCH API (ЛР №5)
// ----------------------------------------
/**
 * ЛР №5, п. 2: Реалізує функцію завантаження даних із data.json засобами Fetch API.
 * Обробляє успішне завантаження та помилки.
 */
async function fetchAndRenderCV() {
    let data;
    try {
        // Виконуємо асинхронний запит до файлу JSON. Шлях відносно кореневої папки dist/.
        const response = await fetch('data/data.json');

        // У разі помилки HTTP (наприклад, 404), генеруємо виняток
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - Could not load data/data.json. Check your Gulp 'data' task.`);
        }

        // ЛР №5, п. 2: Перетворення відповіді на об’єкт даних
        data = await response.json();

        // Передаємо отримані дані для маніпуляції DOM
        renderCV(data);
    } catch (error) {
        // ЛР №5, п. 2: У разі помилки відобразити коротке службове повідомлення
        console.error("Error fetching or parsing CV data:", error);
        // Відображення помилки на сторінці
        const nameElement = document.getElementById('personName');
        const headerText = document.querySelector('.header__text');

        if (nameElement) nameElement.innerHTML = `Error <span class="text-danger">Loading</span>`;
        if (headerText) headerText.textContent = 'Check Console for details';
    }
}

// ЛОГІКА МАНІПУЛЯЦІЇ DOM ТА ГЕНЕРАЦІЇ РОЗМІТКИ (ЛР №4)
/**
 * ЛР №5, п. 3: Заповнює HTML-розмітку даними, отриманими з JSON.
 * @param {object} data - Об'єкт даних CV.
 */
function renderCV(data) {
    // ЛР №4, п. 1 та ЛР №5, п. 3: Підстановка повного імені користувача
    const nameElement = document.getElementById('personName');
    if (nameElement && data.name && data.surname) {
        nameElement.innerHTML = `${data.name.toUpperCase()} <span class="text-secondary">${data.surname.toUpperCase()}</span>`;
    }

    // ЛР №5, п. 3: Заміна статичного вмісту секції "Про мене"
    const aboutMeElement = document.querySelector('#about-me-content .aboutme_text');
    if (aboutMeElement && data.aboutMe) {
        aboutMeElement.textContent = data.aboutMe;
    }

    // ЛР №4, п. 3 та ЛР №5, п. 3: Генерація розмітки на основі масиву (Освіта)
    const educationContainer = document.getElementById('education-content');
    if (educationContainer && data.education) {
        // .map() генерує розмітку для кожного запису масиву
        const educationHtml = data.education.map(item => `
            <div class="card education_card mb-3 shadow-sm border-start border-5 border-primary">
                <div class="card-body p-3">
                    <h4 class="card-title education_card__title fw-bold fs-5">${item.degree}</h4>
                    <p class="card-text education_card__text text-muted mb-0">
                        ${item.institution} <span class="badge bg-primary">${item.years}</span>
                    </p>
                </div>
            </div>
        `).join('');
        educationContainer.innerHTML = educationHtml;
    }

    // ЛР №4, п. 3 та ЛР №5, п. 3: Генерація розмітки на основі масиву (Досвід)
    const experienceContainer = document.getElementById('experience-content');
    if (experienceContainer && data.experience) {
        const experienceHtml = data.experience.map(item => `
            <div class="card experience_card mb-3 shadow-sm border-start border-5 border-success">
                <div class="card-body p-3">
                    <h4 class="card-title experience_card__title fw-bold fs-5">${item.position}</h4>
                    <h5 class="card-subtitle experience_card__subtitle text-success mb-2">
                        <span>${item.duration}</span> ${item.company} / ${item.location}
                    </h5>
                    <p class="card-text experience_card__text">
                        ${item.description}
                    </p>
                </div>
            </div>
        `).join('');
        experienceContainer.innerHTML = experienceHtml;
    }
}


// ----------------------------------------
// ЛОГІКА ЗГОРТАННЯ/РОЗГОРТАННЯ (ЛР №4, п. 2)
// ----------------------------------------
/**
 * ЛР №4, п. 2: Налаштовує обробники подій для кнопок згортання/розгортання.
 */
function setupToggle() {
    /**
     * Перемикає клас видимості для цільового елемента.
     * @param {HTMLElement} element - Елемент, який потрібно згорнути/розгорнути.
     */
    function toggleRollBlock(element) {
        // Знаходимо іконку у батьківському контейнері
        const icon = element.parentElement.querySelector('.toggle-icon');
        const isOpen = element.classList.contains('is-open');

        if (isOpen) {
            // Згортання
            element.classList.remove('is-open');
            element.classList.add('is-closed');
            // ЛР №4, п. 2: Зміна орієнтації стрілки
            if (icon) icon.classList.replace('bi-chevron-up', 'bi-chevron-down');
        } else {
            // Розгортання
            element.classList.remove('is-closed');
            element.classList.add('is-open');
            // ЛР №4, п. 2: Зміна орієнтації стрілки
            if (icon) icon.classList.replace('bi-chevron-down', 'bi-chevron-up');
        }
    }

    // ЛР №4, п. 2: Прив'язка обробника події click до клікабельних заголовків
    document.querySelectorAll('.toggle-icon').forEach(icon => {
        // Шукаємо найближчий клікабельний батьківський елемент, щоб клік працював по всій ширині заголовка
        const clickableParent = icon.closest('.d-flex.cursor-pointer');

        if (clickableParent) {
            clickableParent.addEventListener('click', () => {
                const targetId = icon.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    toggleRollBlock(targetElement); // Викликаємо функцію перемикання
                }
            });
        }
    });

    // Встановлюємо початковий стан: всі блоки мають бути відкритими (за замовчуванням)
    document.querySelectorAll('.roll-block').forEach(block => {
        block.classList.add('is-open');
    });
}

// ----------------------------------------
// ІНІЦІАЛІЗАЦІЯ
// ----------------------------------------
// ЛР №4, п. 1: Виклик функцій після завантаження документа
document.addEventListener('DOMContentLoaded', () => {
    setupToggle();      // Ініціалізація обробників подій (ЛР №4, п. 2)
    fetchAndRenderCV(); // Завантаження даних та рендеринг (ЛР №4, п. 1; ЛР №5)
});