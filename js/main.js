const navTrigger = document.querySelector('#nav_trigger_btn')
const navMenu = document.querySelector('#nav_menu')

navTrigger.addEventListener('click', () =>{
    navMenu.classList.toggle('nav-is-open')
})