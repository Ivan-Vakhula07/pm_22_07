// --- ФУНКЦІОНАЛ (ЛР №4: Згортання, ЛР №5: AJAX) ---

document.addEventListener('DOMContentLoaded', () => {

    // 1. ЛОГІКА ЗГОРТАННЯ/РОЗГОРТАННЯ (ЛР №4)

    /**
     * Перемикає видимість (згортає/розгортає) блок контенту.
     * @param {HTMLElement} element - елемент, що містить клас 'roll-block'.
     */
    function toggleRollBlock(element) {
        // Перевіряємо, чи блок є відкритим
        const isOpen = element.classList.contains('is-open');

        if (isOpen) {
            // Закрити
            element.classList.remove('is-open');
            element.classList.add('is-closed');
        } else {
            // Відкрити
            element.classList.remove('is-closed');
            element.classList.add('is-open');
        }
    }

    // Додаємо обробник подій на всі елементи з класом 'toggle-icon'
    document.querySelectorAll('.toggle-icon').forEach(icon => {
        icon.closest('.d-flex').addEventListener('click', (e) => {
             // Знаходимо target (наприклад, 'about-me-content')
            const targetId = icon.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                toggleRollBlock(targetElement);
            }
        });
    });


    // 2. ЛОГІКА ЗАВАНТАЖЕННЯ ДАНИХ (ЛР №5)

    const dataPath = 'data/data.json';

    /**
     * Завантажує дані з JSON-файлу.
     */
    async function loadData() {
        try {
            const response = await fetch(dataPath);
            if (!response.ok) {
                throw new Error(`Помилка HTTP: ${response.status}`);
            }
            const data = await response.json();
            renderCV(data);
        } catch (error) {
            console.error("Не вдалося завантажити дані:", error);
            // Виведення повідомлення про помилку на сторінку
            document.getElementById('personName').innerHTML = '<span class="text-danger">Помилка завантаження даних!</span>';
        }
    }

    /**
     * Рендерить дані CV на сторінці.
     * @param {Object} data - об'єкт даних з data.json.
     */
    function renderCV(data) {
        // Оновлення імені (ЛР №5, п. 3.2)
        const nameElement = document.getElementById('personName');
        if (nameElement && data.name && data.surname) {
            nameElement.innerHTML = `${data.name.toUpperCase()} <span class="text-secondary">${data.surname.toUpperCase()}</span>`;
        }

        // Оновлення "Про мене" (ЛР №5, п. 3.2)
        const aboutMeElement = document.querySelector('#about-me-content .aboutme_text');
        if (aboutMeElement && data.aboutMe) {
            aboutMeElement.textContent = data.aboutMe;
        }

        // Оновлення Освіти (ЛР №5, п. 3.3)
        const educationContainer = document.getElementById('education-content');
        if (educationContainer && data.education) {
            educationContainer.innerHTML = data.education.map(item => `
                <div class="card education_card mb-3 shadow-sm border-start border-5 border-primary">
                    <div class="card-body p-3">
                        <h4 class="card-title education_card__title fw-bold fs-5">${item.degree}</h4>
                        <p class="card-text education_card__text text-muted mb-0">
                            ${item.institution} <span class="badge bg-primary">${item.years}</span>
                        </p>
                    </div>
                </div>
            `).join('');
        }

        // Оновлення Досвіду (ЛР №5, п. 3.3)
        const experienceContainer = document.getElementById('experience-content');
        if (experienceContainer && data.experience) {
            experienceContainer.innerHTML = data.experience.map(item => `
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
        }
    }

    // Запускаємо завантаження даних при старті
    loadData();
});