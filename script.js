/* =========================
   КАРТОЧКА КНИГИ
========================= */

function createBookCard(book, showNewBadge = false) {

  const tropesHTML = book.tropes
    .map(
      trope => `<span class="tag">${trope}</span>`
    )
    .join("");

  return `
    <article
      class="book-card"
      data-title="${book.title}"
      data-author="${book.author}"
      data-genre="${book.genre}"
    >

      <div class="book-cover">

        <img
          src="${book.cover}"
          alt="Обложка книги ${book.title}"
        >

        ${
          showNewBadge
            ? `<div class="badge">Новинка</div>`
            : ""
        }

      </div>

      <div class="book-content">

        <h3 class="book-title">
          ${book.title}
        </h3>

        <p class="book-author">
          ${book.author}
        </p>

        <p class="book-series">
          ${book.series}
        </p>

        <div class="tags">

          <span class="tag">
            ${book.genre}
          </span>

          ${tropesHTML}

        </div>

        <a
          class="download-btn"
          href="${book.file}"
          download
        >
          ↓ Скачать EPUB
        </a>

      </div>

    </article>
  `;
}


/* =========================
   НОВИНКИ
========================= */

function renderNewBooks() {

  const newGrid =
    document.getElementById("newGrid");

  if (!newGrid) return;

  const newBooks =
    books.filter(
      book => book.newBook
    );

  newGrid.innerHTML =
    newBooks
      .map(
        book =>
          createBookCard(book, true)
      )
      .join("");
}


/* =========================
   ХИТ БИБЛИОТЕКИ — СЛАЙДЕР
========================= */

let currentHitSlide = 0;

function createHitSlide(book, index) {

  const hitTropes =
    book.tropes
      .map(
        trope => `<span class="tag">${trope}</span>`
      )
      .join("");

  return `
    <div
      class="hit-slide ${index === 0 ? "active" : ""}"
      data-hit-index="${index}"
    >

      <div class="hit-card">

        <div class="hit-cover">

          <img
            src="${book.cover}"
            alt="Обложка книги ${book.title}"
          >

        </div>

        <div class="hit-content">

          <div class="hit-label">
            ★ ХИТ БИБЛИОТЕКИ
          </div>

          <h3 class="hit-title">
            ${book.title}
          </h3>

          <p class="hit-author">
            ${book.author}
          </p>

          <p class="hit-series">
            ${book.series}
          </p>

          <div class="tags">

            <span class="tag">
              ${book.genre}
            </span>

            ${hitTropes}

          </div>

          <a
            class="download-btn hit-download"
            href="${book.file}"
            download
          >
            ↓ Скачать EPUB
          </a>

        </div>

      </div>

    </div>
  `;
}


function renderHitSlider() {

  const hitContainer =
    document.getElementById("hitContainer");

  if (!hitContainer) return;

  const hitBooks =
    books.filter(
      book => book.hit
    );

  if (hitBooks.length === 0) {

    hitContainer.innerHTML = "";

    return;
  }

  const slidesHTML =
    hitBooks
      .map(
        (book, index) =>
          createHitSlide(book, index)
      )
      .join("");

  const dotsHTML =
    hitBooks
      .map(
        (_, index) => `
          <button
            class="hit-dot ${index === 0 ? "active" : ""}"
            onclick="goToHitSlide(${index})"
            aria-label="Открыть хит ${index + 1}"
          ></button>
        `
      )
      .join("");

  hitContainer.innerHTML = `
    <div class="hit-slider">

      ${slidesHTML}

      ${
        hitBooks.length > 1

          ? `
            <div class="hit-controls">

              <button
                class="hit-arrow"
                onclick="previousHitSlide()"
                aria-label="Предыдущая книга"
              >
                ←
              </button>

              <div class="hit-dots">
                ${dotsHTML}
              </div>

              <button
                class="hit-arrow"
                onclick="nextHitSlide()"
                aria-label="Следующая книга"
              >
                →
              </button>

            </div>
          `

          : ""
      }

    </div>
  `;

  currentHitSlide = 0;

  setupHitSwipe();
}


function showHitSlide(index) {

  const slides =
    document.querySelectorAll(".hit-slide");

  const dots =
    document.querySelectorAll(".hit-dot");

  if (slides.length === 0) return;

  if (index < 0) {
    index = slides.length - 1;
  }

  if (index >= slides.length) {
    index = 0;
  }

  currentHitSlide = index;

  slides.forEach(
    (slide, slideIndex) => {

      slide.classList.toggle(
        "active",
        slideIndex === index
      );

    }
  );

  dots.forEach(
    (dot, dotIndex) => {

      dot.classList.toggle(
        "active",
        dotIndex === index
      );

    }
  );
}


function nextHitSlide() {

  showHitSlide(
    currentHitSlide + 1
  );

}


function previousHitSlide() {

  showHitSlide(
    currentHitSlide - 1
  );

}


function goToHitSlide(index) {

  showHitSlide(index);

}


/* =========================
   СВАЙП ХИТОВ НА ТЕЛЕФОНЕ
========================= */

function setupHitSwipe() {

  const slider =
    document.querySelector(".hit-slider");

  if (!slider) return;

  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener(
    "touchstart",
    event => {

      touchStartX =
        event.changedTouches[0].screenX;

    },
    {
      passive: true
    }
  );

  slider.addEventListener(
    "touchend",
    event => {

      touchEndX =
        event.changedTouches[0].screenX;

      const distance =
        touchStartX - touchEndX;

      if (Math.abs(distance) < 45) {
        return;
      }

      if (distance > 0) {

        nextHitSlide();

      } else {

        previousHitSlide();

      }

    },
    {
      passive: true
    }
  );
}


/* =========================
   КАТАЛОГ
========================= */

const catalogGrid =
  document.getElementById("catalogGrid");

const emptyMessage =
  document.getElementById("emptyMessage");

const catalogSearch =
  document.getElementById("catalogSearch");

const headerSearch =
  document.getElementById("headerSearch");

let currentGenre = "Все";


function renderCatalog() {

  if (!catalogGrid) return;

  const searchText =
    catalogSearch
      ? catalogSearch.value
          .toLowerCase()
          .trim()
      : "";

  const filteredBooks =
    books.filter(book => {

      const searchableText =
        (
          book.title
          + " "
          + book.author
          + " "
          + book.series
          + " "
          + book.genre
          + " "
          + book.tropes.join(" ")
        )
        .toLowerCase();

      const matchesSearch =
        searchableText.includes(searchText);

      const matchesGenre =
        currentGenre === "Все"
        ||
        book.genre === currentGenre;

      return (
        matchesSearch
        &&
        matchesGenre
      );

    });

  catalogGrid.innerHTML =
    filteredBooks
      .map(
        book =>
          createBookCard(
            book,
            book.newBook
          )
      )
      .join("");

  if (emptyMessage) {

    emptyMessage.style.display =
      filteredBooks.length === 0
        ? "block"
        : "none";

  }

}


/* =========================
   ПОИСК
========================= */

if (catalogSearch) {

  catalogSearch.addEventListener(
    "input",
    renderCatalog
  );

}


if (headerSearch) {

  headerSearch.addEventListener(
    "input",
    function () {

      if (catalogSearch) {

        catalogSearch.value =
          headerSearch.value;

      }

      const catalog =
        document.getElementById("catalog");

      if (catalog) {

        catalog.scrollIntoView({
          behavior: "smooth"
        });

      }

      renderCatalog();

    }
  );

}


/* =========================
   ФИЛЬТРЫ
========================= */

function setGenre(
  genre,
  button
) {

  currentGenre = genre;

  document
    .querySelectorAll(".filter-btn")
    .forEach(
      btn =>
        btn.classList.remove("active")
    );

  if (button) {

    button.classList.add("active");

  }

  renderCatalog();

}


function selectGenre(genre) {

  currentGenre = genre;

  document
    .querySelectorAll(".filter-btn")
    .forEach(btn => {

      btn.classList.toggle(
        "active",
        btn.dataset.genre === genre
      );

    });

  const catalog =
    document.getElementById("catalog");

  if (catalog) {

    catalog.scrollIntoView({
      behavior: "smooth"
    });

  }

  renderCatalog();

}


/* =========================
   ЗАПУСК САЙТА
========================= */

renderNewBooks();

renderHitSlider();

renderCatalog();
