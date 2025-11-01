let pictureArr = [
    './Img/avenue.jpg',
    './Img/blossoms.jpg',
    './Img/buildings.jpg',
    './Img/cat.jpg',
    './Img/desert.jpg',
    './Img/iceberg.jpg',
    './Img/horse.jpg',
    './Img/anime-City.jpg',
    './Img/anime-Boy.jpg',
    './Img/elephant.jpg',
    './Img/ai-Woman.jpg',
    './Img/science-Fiction.jpg',
];


function render() {
    let contentRef = document.getElementById("content");
    for (let index = 0; index < pictureArr.length; index++) {
    contentRef.innerHTML += getNoteTemplate(index);
    }
}
function getNoteTemplate(index) {
    return `<img src="${pictureArr[index]}" alt="dialog" aria-haspopup="dialog" aria-controls="pictureDialog-${index}" tabindex="0" onclick="openDialog(${index})"/>`;
}

function getDialogTemplate(index) {
    return `<div class="dialog-content">
    <header class="dialog-header">
    <h2>${imgName(index)}</h2>
        <button class="close-button" aria-label="close button" tabindex="0" onclick="closeDialog(${index})">X</button>
    </header>
    <section>
        <img id="dialogImage" src="${pictureArr[index]}" class="dialog-picture" alt="Preview Image" />
        <p id="dialogDescription"></p>
    </section>
    <footer class="dialog-footer">
    <button class="back-button" aria-label="go to previous image" onclick="imgBack(${index})">Back</button>
        <p>${getImgNumber(index)}/12</p>
    <button class="next-button" aria-label="go to next image" onclick="imgNext(${index})">Next</button>
    </footer>
        </div
    `;
}

function openDialog(index) {
    let dialogRef = document.getElementById("imageDialog");
    dialogRef.innerHTML = getDialogTemplate(index);
    dialogRef.showModal();
}
function closeDialog() {
    let dialogRef = document.getElementById("imageDialog");
    dialogRef.close();
}
function imgName(index) {
    return pictureArr[index].slice(6).charAt(0).toUpperCase().replace(/-/g, ' ').replace('.jpg', '') + pictureArr[index].slice(7).replace(/-/g, ' ').replace('.jpg', '');
}
function getImgNumber(index) {
    return index + 1;
}
function imgNext(index) {
    index = (index + 1) % pictureArr.length;
    openDialog(index);
}
function imgBack(index) {
    index = (index - 1 + pictureArr.length) % pictureArr.length;
    openDialog(index);
}


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

