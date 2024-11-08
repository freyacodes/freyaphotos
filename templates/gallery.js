currentImage = null;

document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.getElementsByClassName("gallery-card")).forEach(element => {
        element.removeAttribute("href");
        element.addEventListener("click", () => {
            pushHistoryForImage(element.name);
        });
    });

    document.getElementById("slide-center").addEventListener("click", (event) => {
      if (event.target.tagName != "IMG") pushHistoryForImage(null, true);
    });

    if (location.hash !== "") {
        pushHistoryForImage(location.hash.substring(1), true);
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key == "Escape") {
        pushHistoryForImage(null, true);
    } else if (event.key == "ArrowLeft") {
        previousImage()
    } else if (event.key == "ArrowRight") {
        nextImage()
    }
});

function previousImage() {
    if (currentImage == null) return;
    if (currentImage.previous == undefined) return;
    pushHistoryForImage(currentImage.previous, true);
}

function nextImage() {
    if (currentImage == null) return;
    if (currentImage.next == undefined) return;
    pushHistoryForImage(currentImage.next, true);
}

addEventListener("popstate", (event) => {
    onStateChanged(event.state);
});

function onStateChanged(state) {
    if (state == null || state.image == undefined) {
        currentImage = null;

        // Exit the modal
        document.body.className = "";
        document.getElementById("image-container-center").src = "";
        currentImage = null;
    } else {
        currentImage = manifest[state.image];
        if (currentImage == null) return;
        openModal(currentImage);
    }
}

function openModal(manifestEntry) {
    currentImage = manifestEntry;
    const meta = manifestEntry.meta;

    if (manifestEntry.previous != null) {
        applyImage(document.getElementById("slide-container-left"), manifest[manifestEntry.previous])
    }
    applyImage(document.getElementById("slide-container-center"), manifestEntry)
    if (manifestEntry.next != null) {
        applyImage(document.getElementById("slide-container-left"), manifest[manifestEntry.next])
    }

    document.getElementById("metadata-tbody").childNodes.forEach(tr => {
        if (tr.nodeType != 1) return;
        const key = tr.getAttribute("key");
        if (key == undefined) return;
        const value = meta[key];
        tr.lastElementChild.innerText = value != undefined ? value : "";
    });

    document.body.className = "modal-present";
    preload(manifestEntry.next);
    preload(manifestEntry.previous);
}

function applyImage(slideContainer, image) {
    slideContainer.querySelector(".modal-header").innerText = image.meta.name;
    const imageContainer = slideContainer.querySelector(".image-container");
    imageContainer.src = "";
    imageContainer.src = image.url;
}

function preload(name) {
    if (name == undefined) return;
    const manifestEntry = manifest[name];
    if (manifestEntry.preloading == true) return;
    const preloadLink = document.createElement("link");
    preloadLink.href = manifestEntry.url;
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    document.head.appendChild(preloadLink);
    manifestEntry.preloading = true;
}

function pushHistoryForImage(image, replace) {
    const newUrl = new URL(location);
    if (image != null) {
        newUrl.hash = "#" + image;
    } else {
        newUrl.hash = "";
    }

    const state = { image: image };
    if (replace) {
        history.replaceState(state, "", newUrl);
    } else {
        history.pushState(state, "", newUrl);
    }
    onStateChanged(state);
}
