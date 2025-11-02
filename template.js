function getNoteTemplate(index) {
  return `<img src="${allPictures[index]}" alt="dialog" aria-haspopup="dialog" aria-controls="pictureDialog-${index}" tabindex="0" />`;
}
function getDialogTemplate(index) {
  return `<div class="dialog-content">
    <header class="dialog-header">
    <h3>${imgName(index)}</h3>
        <button class="close-button" aria-label="close button" tabindex="0" onclick="closeDialog(${index})">X</button>
    </header>
    <section>
        <img id="dialogImage" src="${
          allPictures[index]
        }" class="dialog-picture" alt="Preview Image" />
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
