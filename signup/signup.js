const log_in = document.querySelector("#log-in");
const sign_up = document.querySelector("#sign-up");
const container = document.querySelector(".container");

log_in.addEventListener("click", () =>{
  container.classList.add("log-in-mode");
});

sign_up.addEventListener("click", () =>{
  container.classList.remove("log-in-mode");
});