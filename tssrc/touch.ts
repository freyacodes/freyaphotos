// Notes for future Freya:
// Consider:
// - https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
// - https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action

import * as Gallery from "./gallery.js"

function startup() {
    document.body.addEventListener("touchstart", onTouchStart)
    document.body.addEventListener("touchend", onTouchEnd)
    document.body.addEventListener("touchcancel", onTouchCancel)
    document.body.addEventListener("touchmove", onTouchMove)
}

document.addEventListener("DOMContentLoaded", startup)

const touches = {}
const touchThreshold = 0.03

type trackedTouch = {
    identifier: number,
    startX: number,
    startY: number,
    lastX: number,
    lastY: number
}
let trackedTouch: trackedTouch | null = null
let isHorizontalSwipe = false
let isVerticalSwipe = false

function onTouchStart(event: TouchEvent) {
    if (!shouldHandleTouchEvent()) return
    event.preventDefault()
    for (const touch of event.changedTouches) {
        touches[touch.identifier] = {
            identifier: touch.identifier,
            startX: touch.clientX,
            startY: touch.clientY,
            lastX: touch.clientX,
            lastY: touch.clientY
        }
    }
}

function onTouchMove(event: TouchEvent) {
    if (!shouldHandleTouchEvent()) return
    event.preventDefault()
    for (const touch of event.changedTouches) {
        //console.log(touch)
        const state = touches[touch.identifier]
        state.lastX = touch.clientX
        state.lastY = touch.clientY
        if (trackedTouch == null) {
            const xDiff = (state.lastX - state.startX) / window.innerWidth
            const yDiff = (state.lastY - state.startY) / window.innerHeight

            if (Math.abs(xDiff) >= touchThreshold && shouldAcceptHorizontalSwipe(xDiff < 0)) {
                trackedTouch = state
                isHorizontalSwipe = true
                console.log("Captured horizontal", state, trackedTouch)
            } else if (Math.abs(yDiff) >= touchThreshold && shouldAcceptVerticalSwipe(yDiff < 0)) {
                trackedTouch = state
                isVerticalSwipe = false
                console.log("Captured vertical", state, trackedTouch)
            }
        }
    }
}

function onTouchCancel(event: TouchEvent) {
    if (!shouldHandleTouchEvent()) return
    event.preventDefault()
    for (const touch of event.changedTouches) {
        delete touches[touch.identifier]

        console.log(touch.identifier, trackedTouch)

        if (trackedTouch != null && touch.identifier == trackedTouch.identifier) {
            trackedTouch = null
            console.log("Touch cancelled")
        }
    }
}

function onTouchEnd(event: TouchEvent) {
    if (!shouldHandleTouchEvent()) return
    event.preventDefault()
    for (const touch of event.changedTouches) {
        delete touches[touch.identifier]

        console.log(touch.identifier, trackedTouch)

        if (trackedTouch != null && touch.identifier == trackedTouch.identifier) {
            trackedTouch = null
            console.log("Touch ended")
        }
    }
}

function shouldHandleTouchEvent() {
    return Gallery.getCurrentImage() != null
}

function shouldAcceptHorizontalSwipe(left: boolean) {
    const currentImage = Gallery.getCurrentImage();
    if (currentImage == null) return false
    if (left && currentImage.previous == null) return false
    if (!left && currentImage.next == null) return false
    return true
}

function shouldAcceptVerticalSwipe(up: boolean) {
    return false
}
