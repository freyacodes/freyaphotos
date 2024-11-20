import manifest, { ManifestEntry } from "./manifest";
let currentImage: ManifestEntry | null = null;
type HistoryState = { image: string | null }

document.addEventListener("DOMContentLoaded", () => {
    Array.from(document.getElementsByClassName("gallery-card")).forEach(element => {
        element.removeAttribute("href");
        element.addEventListener("click", () => {
            pushHistoryForImage(element!.getAttribute("name"), false);
        });
    });

    document.getElementById("slide-center")!.addEventListener("click", (event) => {
      if ((event.target as HTMLElement).tagName != "IMG") pushHistoryForImage(null, true);
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

function onStateChanged(state: HistoryState) {
    if (state == null || state.image == undefined) {
        currentImage = null;

        // Exit the modal
        document.body.className = "";
        document.getElementById("image-container-center")!.setAttribute("src", "");
        currentImage = null;
    } else {
        currentImage = manifest[state.image];
        if (currentImage == null) return;
        openModal(currentImage);
    }
}

function openModal(manifestEntry: ManifestEntry) {
    currentImage = manifestEntry;
    const meta = manifestEntry.meta;

    if (manifestEntry.previous != null) {
        applyImage(document.getElementById("slide-container-left")!, manifest[manifestEntry.previous])
    }
    applyImage(document.getElementById("slide-container-center")!, manifestEntry)
    if (manifestEntry.next != null) {
        applyImage(document.getElementById("slide-container-right")!, manifest[manifestEntry.next])
    }

    document.getElementById("metadata-tbody")!.childNodes.forEach(node => {
        if (node.nodeType != 1) return;
        const tr = node as HTMLElement
        const key = tr.getAttribute("key");
        if (key == undefined) return;
        const value = meta[key];
        (tr.lastElementChild as HTMLElement).innerText = value != undefined ? value : "";
    });

    document.body.className = "modal-present";
    preload(manifestEntry.next);
    preload(manifestEntry.previous);
}

function applyImage(slideContainer: HTMLElement, image: ManifestEntry) {
    (slideContainer.querySelector(".modal-header") as HTMLElement).innerText = image.meta.name;
    const imageContainer = slideContainer.querySelector(".image-container")!;
    imageContainer.setAttribute("src", "");
    imageContainer.setAttribute("src", image.url);
}

function preload(imageName: string | null) {
    if (imageName == undefined) return;
    const manifestEntry = manifest[imageName];
    if (manifestEntry.preloading == true) return;
    const preloadLink = document.createElement("link");
    preloadLink.href = manifestEntry.url;
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    document.head.appendChild(preloadLink);
    manifestEntry.preloading = true;
}

function pushHistoryForImage(imageName: string | null, replace?: boolean) {
    const newUrl = new URL(location.href);
    if (imageName != null) {
        newUrl.hash = "#" + imageName;
    } else {
        newUrl.hash = "";
    }

    const state = { image: imageName };
    if (replace) {
        history.replaceState(state, "", newUrl);
    } else {
        history.pushState(state, "", newUrl);
    }
    onStateChanged(state);
}

export function getCurrentImage(): ManifestEntry | null {
    return currentImage;
}

