/**
 * Remote Controller Program for Omni Wheel Car
 * Uses IMU (Accelerometer) for tilt control and buttons for rotation.
 */

radio.setGroup(1)
basic.showIcon(IconNames.Happy)

let x = 0
let y = 0
let r = 0

basic.forever(function () {
    // 1. Get Tilt Data (Accelerometer)
    // Pitch (Forward/Backward)
    let pitch = input.rotation(Rotation.Pitch) // -90 to 90
    // Roll (Left/Right)
    let roll = input.rotation(Rotation.Roll)   // -90 to 90

    // 2. Map Tilt to Speed (-255 to 255)
    // Deadzone of 10 degrees to prevent unintended movement
    if (Math.abs(pitch) > 10) {
        // Tilt forward (positive pitch) -> forward movement
        y = Math.map(pitch, 10, 60, 0, 200)
        if (pitch < 0) y = Math.map(pitch, -10, -60, 0, -200)
    } else {
        y = 0
    }

    if (Math.abs(roll) > 10) {
        // Invert X direction as requested: Tilt right (positive roll) -> negative x
        x = Math.map(roll, 10, 60, 0, -200)
        if (roll < 0) x = Math.map(roll, -10, -60, 0, 200)
    } else {
        x = 0
    }

    // 3. Button Control for Rotation (Spin)
    if (input.buttonIsPressed(Button.A)) {
        r = -150 // Spin Left
    } else if (input.buttonIsPressed(Button.B)) {
        r = 150  // Spin Right
    } else {
        r = 0
    }

    // 4. Send Commands via Radio
    radio.sendValue("x", Math.constrain(x, -255, 255))
    radio.sendValue("y", Math.constrain(y, -255, 255))
    radio.sendValue("r", Math.constrain(r, -255, 255))

    // 5. Visual Feedback on Controller
    if (Math.abs(y) > 50 || Math.abs(x) > 50 || Math.abs(r) > 50) {
        led.plot(2 + x / 100, 2 + y / 100)
    } else {
        basic.showIcon(IconNames.SmallDiamond)
    }

    basic.pause(50)
})

// Optional: Calibration or stop command on shake
input.onGesture(Gesture.Shake, function () {
    radio.sendValue("x", 0)
    radio.sendValue("y", 0)
    radio.sendValue("r", 0)
    basic.showIcon(IconNames.Angry)
    basic.pause(500)
    basic.showIcon(IconNames.Happy)
})
