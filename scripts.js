let slideIndex = 1;
showSlides(slideIndex);

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("carru-image");
    let dots = document.getElementsByClassName("dot");

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}


// ===========================================
// CONFIGURACIÓN — CAMBIA ESTO
// ===========================================
const PLACE_ID = "ChIJ6bXqBlmRYA0R6pcaoMqm-xs";
const API_KEY = "";
const MAX_REVIEWS = 3; // número de reseñas que quieres mostrar
// ===========================================

function loadGoogleReviews() {
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const reviews = data.result.reviews.slice(0, MAX_REVIEWS);
            const container = document.getElementById("reviews-list");

            reviews.forEach(r => {
                container.innerHTML += `
                <div class="review-item">
                    <div class="review-header">
                        <div class="review-author">${r.author_name}</div>
                        <div class="review-stars">${"⭐".repeat(r.rating)}</div>
                    </div>
                    <div class="review-text">${r.text}</div>
                </div>
            `;
            });
        })
        .catch(err => console.error("ERROR AL CARGAR RESEÑAS: ", err));
}

loadGoogleReviews();




