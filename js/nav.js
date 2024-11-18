// js/nav.js
export function openNav() {
    document.getElementById("mySidebar").style.width = "45%";
    document.getElementById("mainContent").classList.add("blurred");
}

export function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("mainContent").classList.remove("blurred");
}

