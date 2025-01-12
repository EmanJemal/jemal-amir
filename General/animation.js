// script.js

window.onload = () => {
    // Wait until everything (DOM, CSS, images, scripts) is fully loaded
    setTimeout(() => { // Optional slight delay for smooth animation
        document.getElementById('loading-overlay').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 500);
};
