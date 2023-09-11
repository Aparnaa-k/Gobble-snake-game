const scoreText = document.getElementById("scoreVal");
let points = localStorage.getItem("score");
scoreText.innerText = points;

function redirectToGamePage() {
  window.location = "game_page.html";
}
