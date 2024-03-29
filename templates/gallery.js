let currentImage = null;

document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.getElementsByClassName("gallery-card")).forEach(element => {
        element.removeAttribute("href");
        element.addEventListener("click", () => {
            pushHistoryForImage(element.name);
        });
    });

    document.getElementById("modal-left").addEventListener("click", (event) => {
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
        if (currentImage == null) return;
        if (currentImage.previous == undefined) return;
        pushHistoryForImage(currentImage.previous);
    } else if (event.key == "ArrowRight") {
        if (currentImage == null) return;
        if (currentImage.next == undefined) return;
        pushHistoryForImage(currentImage.next);
    }
});

addEventListener("popstate", (event) => {
    onStateChanged(event.state);
});

function onStateChanged(state) {
    if (state.image == undefined) {
        currentImage = null;

        // Exit the modal
        document.body.className = "";
        document.getElementById("image-container").src = "";
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
    document.getElementById("image-container").src = "";
    document.getElementById("image-container").src = manifestEntry.url;
    document.getElementById("modal-header").innerText = meta.name;

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
