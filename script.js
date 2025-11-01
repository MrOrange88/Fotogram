const originalPictures = [
  "./Img/avenue.jpg",
  "./Img/blossoms.jpg",
  "./Img/buildings.jpg",
  "./Img/cat.jpg",
  "./Img/desert.jpg",
  "./Img/iceberg.jpg",
  "./Img/horse.jpg",
  "./Img/anime-City.jpg",
  "./Img/anime-Boy.jpg",
  "./Img/elephant.jpg",
  "./Img/ai-Woman.jpg",
  "./Img/science-Fiction.jpg",
];

let allPictures = originalPictures.slice();

function toggleSavedTheme() {
  let theme = "dark";
  if (document.body.classList.contains("dark-mode")) {
    theme = "light";
  }
  window.localStorage.setItem("theme", theme);
}

function applySavedTheme() {
  const themeButton = document.getElementById("themeToggle");
  const body = document.body;
  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    themeButton.textContent = "Light Theme";
  } else {
    body.classList.remove("dark-mode");
    themeButton.textContent = "Dark Theme";
  }
}

function loadImagesFromStorage() {
  const raw = window.localStorage.getItem("files");
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        return data;
      }
    } catch (e) {
      // hier ignorieren wir den fehler einfach :)
      console.error("dieser fehler wurde ignoriert °,..,°", e);
    }
  }

  return [];
}

/**
 * @param {File} file
 */
function saveImageInLocalStorage(file) {
  const data = loadImagesFromStorage();
  data.push(file);
  window.localStorage.setItem("files", JSON.stringify(data));
}

function clearImagesInLocalStorage() {
  window.localStorage.removeItem("files");
}

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();

  const themeButton = document.getElementById("themeToggle");
  themeButton.addEventListener("click", () => {
    toggleSavedTheme();
    applySavedTheme();
  });

  const dialogRef = document.getElementById("imageDialog");
  if (dialogRef) {
    dialogRef.addEventListener("click", (event) => {
      // Close dialog if clicked outside content area
      const rect = dialogRef.getBoundingClientRect();
      const isInDialogContent =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!isInDialogContent) {
        dialogRef.close();
      }
    });
  }

  const uploadButton = document.getElementById("upload-button");
  uploadButton.addEventListener("click", () => {
    handleUpload();
  });

  const removeUploadButton = document.getElementById("remove-upload-button");
  removeUploadButton.addEventListener("click", () => {
    clearImagesInLocalStorage();
    render();
  });
});

function render() {
  // reset all pictures to original pictures
  allPictures = originalPictures.slice();

  // add images from storage
  const storedPictures = loadImagesFromStorage();
  storedPictures.forEach((file) => allPictures.push(file));

  let contentRef = document.getElementById("content");
  // cleanup contentRef
  contentRef.innerHTML = "";
  for (let index = 0; index < allPictures.length; index++) {
    contentRef.innerHTML += getNoteTemplate(index);
  }
  document.querySelectorAll('img[aria-haspopup="dialog"]').forEach((img) => {
    img.addEventListener("click", (event) => {
      const index = Array.from(
        document.querySelectorAll('img[aria-haspopup="dialog"]')
      ).indexOf(event.target);
      openDialog(index);
    });
    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const index = Array.from(
          document.querySelectorAll('img[aria-haspopup="dialog"]')
        ).indexOf(event.target);
        openDialog(index);
      }
    });
  });
}

function getNoteTemplate(index) {
  return `<img src="${allPictures[index]}" alt="dialog" aria-haspopup="dialog" aria-controls="pictureDialog-${index}" tabindex="0" />`;
}

function getDialogTemplate(index) {
  return `<div class="dialog-content">
    <header class="dialog-header">
    <h2>${imgName(index)}</h2>
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

function openDialog(index) {
  let dialogRef = document.getElementById("imageDialog");
  dialogRef.innerHTML = getDialogTemplate(index);
  dialogRef.showModal();
}

function closeDialog() {
  let dialogRef = document.getElementById("imageDialog");
  dialogRef.close();
}

function imgName2(index) {
  const picturePath = allPictures[index]; // ./Img/science-Fiction.jpg
  const splittedPicturePath = picturePath.split("/"); // [".", "Img", "science-Fiction.jpg"]
  const fileName = splittedPicturePath[splittedPicturePath.length - 1]; // science-Fiction.jpg
  const splittedFileName = fileName.split("."); // ["science-Fiction", "jpg"]
  let name = splittedFileName[0]; // science-Fiction
  name = name.replace(/-/g, " "); // science Fiction
  name = name.replace(/_/g, " "); // entfernt auch Unterstriche
  return name
    .split(" ") // split
    .map((v) => v[0].toUpperCase() + v.slice(1)) // jedes wort
    .join(" "); // und wieder zusammen
}

function imgName(index) {
  return (
    allPictures[index]
      .slice(6)
      .charAt(0)
      .toUpperCase()
      .replace(/-/g, " ")
      .replace(".jpg", "") +
    allPictures[index].slice(7).replace(/-/g, " ").replace(".jpg", "")
  );
}
function getImgNumber(index) {
  return index + 1;
}
function imgNext(index) {
  index = (index + 1) % allPictures.length;
  openDialog(index);
}
function imgBack(index) {
  index = (index - 1 + allPictures.length) % allPictures.length;
  openDialog(index);
}

function handleUpload() {
  const fileInput = document.querySelector("input[name=file]");
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    for (let index = 0; index < fileInput.files.length; index++) {
      uploadFile(fileInput.files[index], index);
    }

    // Clear the file input after upload
    fileInput.value = "";
  }
}

/**
 * @param {File} file
 * @param {number} index
 */
function uploadFile(file, index) {
  console.log("upload file:", file);

  // hier wollen wir den inhalt des bildes auslesen
  // um diesen im local storage zu speichern
  // das funktioniert mit dem FileReader
  // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    saveImageInLocalStorage(reader.result);
    render();
  };

  reader.onerror = (err) => {
    console.error("Beim lesen der Datei ist was schiefgegangen T_T", err);
  };
}
