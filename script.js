document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  setupThemeToggleButtonClickEvent();
  setupOutsideDialogClickEvent();
  setupDialogKeyboardNavigationEvent();
  setupUploadButtonClickEvent();
  setupRemoveUploadButtonClickEvent();
  render();
});

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

function saveImageInLocalStorage(file) {
  const data = loadImagesFromStorage();
  data.push(file);
  window.localStorage.setItem("files", JSON.stringify(data));
}

function clearImagesInLocalStorage() {
  window.localStorage.removeItem("files");
}

function updateAllPictures() {
  allPictures = originalPictures.slice();

  const storedPictures = loadImagesFromStorage();
  storedPictures.forEach((file) => allPictures.push(file));
}

function render() {
  updateAllPictures();
  renderContentImages();
  setupContentImagesEvents();
}

function renderContentImages() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  for (let index = 0; index < allPictures.length; index++) {
    contentRef.innerHTML += getNoteTemplate(index);
  }
}

function setupContentImagesEvents() {
  document.querySelectorAll('img[aria-haspopup="dialog"]').forEach((img) => {
    setupContentImageClickEvent(img);
    setupContentImageKeydownEvent(img);
  });
}

function setupContentImageClickEvent(img) {
  img.addEventListener("click", (event) => {
    imageClickedEventHandler(event);
  });
}

function setupContentImageKeydownEvent(img) {
  img.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      imageClickedEventHandler(event);
    }
  });
}

function imageClickedEventHandler(event) {
  const index = Array.from(
    document.querySelectorAll('img[aria-haspopup="dialog"]')
  ).indexOf(event.target);
  openDialog(index);
}

function openDialog(index) {
  let dialogRef = document.getElementById("imageDialog");
  dialogRef.dataset.index = index;
  dialogRef.innerHTML = getDialogTemplate(index);
  dialogRef.showModal();
}

function closeDialog() {
  let dialogRef = document.getElementById("imageDialog");
  dialogRef.close();
}

function imgName(index) {
  const picture = allPictures[index];
  if (picture.startsWith("data")) return "Uploaded Image";
  return (
    picture
      .slice(6)
      .charAt(0)
      .toUpperCase()
      .replace(/-/g, " ")
      .replace(".jpg", "") +
    picture.slice(7).replace(/-/g, " ").replace(".jpg", "")
  );
}

function getImgNumber(index) {
  return index + 1;
}

function getIndexFromDialog() {
  try {
    return parseInt(document.getElementById("imageDialog").dataset.index);
  } catch (e) {
    console.log("fehler beim auslesen des index aus dem dialog data attribute");
  }
  return 0;
}

function imgNext() {
  const index = getIndexFromDialog();
  let nextIndex = index + 1;
  if (nextIndex >= allPictures.length) {
    nextIndex = 0;
  }
  openDialog(nextIndex);
}

function imgBack() {
  const index = getIndexFromDialog();
  let previousIndex = index - 1;
  if (previousIndex < 0) {
    previousIndex = allPictures.length - 1;
  }
  openDialog(previousIndex);
}

function handleUpload() {
  const fileInput = document.querySelector("input[name=file]");
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    for (let index = 0; index < fileInput.files.length; index++) {
      uploadFile(fileInput.files[index]);
    }

    fileInput.value = "";
  }
}

function uploadFile(file) {
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

function setupThemeToggleButtonClickEvent() {
  const themeButton = document.getElementById("themeToggle");
  themeButton.addEventListener("click", () => {
    toggleSavedTheme();
    applySavedTheme();
  });
}

function isClickEventInsideDialog(dialog, event) {
  const rect = dialog.getBoundingClientRect();
  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
}

function setupOutsideDialogClickEvent() {
  const dialogRef = document.getElementById("imageDialog");
  if (dialogRef) {
    dialogRef.addEventListener("click", (event) => {
      if (!isClickEventInsideDialog(dialogRef, event)) {
        dialogRef.close();
      }
    });
  }
}

function setupDialogKeyboardNavigationEvent() {
  document.addEventListener("keydown", (event) => {
    const dialogRef = document.getElementById("imageDialog");
    if (!dialogRef.open) return;
    if (event.key === "ArrowRight") {
      imgNext();
    } else if (event.key === "ArrowLeft") {
      imgBack();
    } else if (event.key === "Escape") {
      closeDialog();
    }
  });
}

function setupUploadButtonClickEvent() {
  const uploadButton = document.getElementById("upload-button");
  uploadButton.addEventListener("click", (event) => {
    handleUpload();
  });
}

function setupRemoveUploadButtonClickEvent() {
  const removeUploadButton = document.getElementById("remove-upload-button");
  removeUploadButton.addEventListener("click", () => {
    clearImagesInLocalStorage();
    render();
  });
}
