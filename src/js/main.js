import '../index.css'
import 'flowbite'


document.addEventListener("DOMContentLoaded", () => {
    const tabHeaders = document.querySelectorAll(".tab-header");

    tabHeaders.forEach(tabHeader => {
        tabHeader.addEventListener("click", () => {
            const content = tabHeader.nextElementSibling;
            const icon = tabHeader.querySelector(".toggle-icon");

            if (content.style.visibility === "hidden" || content.style.visibility === "") {
                content.style.visibility = "visible";  // Show the content
                icon.innerHTML = "▲";  // Change icon to "open"
            } else {
                content.style.visibility = "hidden";  // Hide the content
                icon.innerHTML = "▼";  // Change icon to "closed"
            }
        });
    });
});





