let currentImage = null;

document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.getElementsByClassName("gallery-card")).forEach(element => {
        element.removeAttribute("href");
        element.addEventListener("click", () => {
            openModal(manifest[element.name]);
        });
    });

    document.getElementById("modal-left").addEventListener("click", (event) => {
      if (event.target.tagName != "IMG") exitModal();
    });
});

document.addEventListener("keyup", (event) => {
    if (event.key == "Escape") {
        exitModal();
    } else if (event.key == "ArrowLeft") {
        if (currentImage == null) return;
        if (currentImage.previous == undefined) return;
        openModal(manifest[currentImage.previous]);
    } else if (event.key == "ArrowRight") {
        if (currentImage == null) return;
        if (currentImage.next == undefined) return;
        openModal(manifest[currentImage.next]);
    }
});

function exitModal() {
    document.body.className = "";
    document.getElementById("image-container").src = "";
    currentImage = null;
}

function openModal(manifestEntry) {
    currentImage = manifestEntry;
    const meta = manifestEntry.meta;
    document.getElementById("image-container").src = ""
    document.getElementById("image-container").src = manifestEntry.url;
    document.getElementById("modal-header").innerText = meta.name
    
    document.body.className = "modal-present";
    preload(manifestEntry.next)
    preload(manifestEntry.previous)
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
