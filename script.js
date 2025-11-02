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
// code zu lang
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
// code zu lang
function render() {
  allPictures = originalPictures.slice();

  const storedPictures = loadImagesFromStorage();
  storedPictures.forEach((file) => allPictures.push(file));

  let contentRef = document.getElementById("content");

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

function openDialog(index) {
  let dialogRef = document.getElementById("imageDialog");
  dialogRef.innerHTML = getDialogTemplate(index);
  dialogRef.showModal();

  addDialogKeyboardNavigation(index);
}

function addDialogKeyboardNavigation(index) {
  function handleKeyDown(event) {
    if (event.key === "ArrowRight") {
      imgNext(index);
    } else if (event.key === "ArrowLeft") {
      imgBack(index);
    } else if (event.key === "Escape") {
      closeDialog();
    }
  }
  document.removeEventListener("keydown", window._dialogKeyListener);
  window._dialogKeyListener = handleKeyDown;
  document.addEventListener("keydown", handleKeyDown);
}

function closeDialog() {
  let dialogRef = document.getElementById("imageDialog");
  dialogRef.close();
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

    fileInput.value = "";
  }
}

/**
 * @param {File} file
 * @param {number} index
 */

function uploadFile(file, index) {
  console.log("upload file:", file);

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
