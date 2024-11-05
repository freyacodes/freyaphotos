function startup() {
    document.body.addEventListener("touchstart", onTouchStart)
    document.body.addEventListener("touchend", onTouchEnd)
    document.body.addEventListener("touchcancel", onTouchCancel)
    document.body.addEventListener("touchmove", onTouchMove)
}
  
document.addEventListener("DOMContentLoaded", startup)

function onTouchStart(event) {
    console.log("Touch", event)
}

function onTouchMove(event) {
    console.log("Move", event)
}

function onTouchCancel(event) {
    console.log("Cancel", event)
}

function onTouchEnd(event) {
    console.log("End", event)
}