document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.getElementById('themeToggle');
    const body = document.body;

    themeButton.addEventListener('click', () => {
        
        body.classList.toggle('dark-mode');

        
        if (body.classList.contains('dark-mode')) {
            themeButton.textContent = 'Light Theme';
        } else {
            themeButton.textContent = 'Dark Theme';
        }
    });
});

