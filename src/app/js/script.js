const btnRoll = document.getElementsByClassName("roll");
const blockRoll = document.getElementsByClassName("roll-block");

// Додаємо слухачі подій для кожної кнопки
Array.from(btnRoll).forEach((btn, index) => {
    btn.addEventListener("click", () => showOrHide(blockRoll[index]));
});

// Функція для розгортання/згортання
function showOrHide(block) {
    if (block.style.maxHeight && block.style.maxHeight !== "0px") {
        block.style.maxHeight = "0"; // Згорнути
    } else {
        block.style.maxHeight = block.scrollHeight + "px"; // Розгорнути до висоти контенту
    }
}
// Fetch API req
async function getData() {
    try{
        const response = await fetch("http://localhost:8080/data/data.json",{cache:"no-store"});
        if (!response.ok) {
            throw new Error('Помилка при завантаженні даних');
        }
        const json = await response.json();
        renderData(json,"Fetch API");
    }catch(error){
        console.error('Помилка під час отримання даних:', error);
    }
}

getData();

// Show data on page
function renderData(data) {

    const about_me_container = document.getElementById("about-me-container");

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
}