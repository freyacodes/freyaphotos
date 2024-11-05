function startup() {
    document.body.addEventListener("touchstart", onTouchStart)
    document.body.addEventListener("touchend", onTouchEnd)
    document.body.addEventListener("touchcancel", onTouchCancel)
    document.body.addEventListener("touchmove", onTouchMove)
}

document.addEventListener("DOMContentLoaded", startup)

const touches = {}

function onTouchStart(event) {
    event.preventDefault()
    for (const touch of event.changedTouches) {
        touches[touch.identifier] = {
            startX: touch.screenX,
            startY: touch.screenY
        }
    }
}

function onTouchMove(event) {
    event.preventDefault()
}

function onTouchCancel(event) {
    event.preventDefault()
    for (const touch of event.changedTouches) {
        delete touches[touch.identifier]
    }
}

function onTouchEnd(event) {
    event.preventDefault()
    for (const touch of event.changedTouches) {
        delete touches[touch.identifier]
    }
}