/**
 * Receiver Program for Omni/Mecanum Wheel Car
 * Hardware: micro:bit + DF-Robot DFR0548 (DF-Driver)
 */

radio.setGroup(1)
basic.showIcon(IconNames.No) // Initial state: Stop/Wait

let x = 0
let y = 0
let r = 0
let lastMessageTime = 0

// Radio receiver: parse motion commands
radio.onReceivedValue(function (name, value) {
    lastMessageTime = control.millis()
    if (name == "x") {
        x = value
    } else if (name == "y") {
        y = value
    } else if (name == "r") {
        r = value
    }
})

basic.forever(function () {
    // Safety: Stop if radio signal lost for > 500ms
    if (control.millis() - lastMessageTime > 500) {
        x = 0
        y = 0
        r = 0
        basic.showIcon(IconNames.Asleep)
    } else {
        // Show motion indicator
        if (Math.abs(y) > 20) {
            basic.showLeds(`
                . . # . .
                . # # # .
                # . # . #
                . . # . .
                . . # . .
                `)
        } else if (Math.abs(x) > 20) {
            basic.showLeds(`
                . . # . .
                . # . . .
                # # # # #
                . # . . .
                . . # . .
                `)
        } else if (Math.abs(r) > 20) {
            basic.showIcon(IconNames.Rollerskate)
        } else {
            basic.showIcon(IconNames.Yes)
        }
    }

    /**
     * Mecanum Wheel Kinematics Calculation
     * Wheel Layout:
     * M1 (FL)  [ / ] --- [ \ ]  M2 (FR)
     * M3 (BL)  [ \ ] --- [ / ]  M4 (BR)
     * 
     * Speed mapping (0-255):
     * FL = y + x + r
     * FR = y - x - r
     * BL = y - x + r
     * BR = y + x - r
     */

    let speedFL = Math.constrain(y + x + r, -255, 255)
    let speedFR = Math.constrain(y - x - r, -255, 255)
    let speedBL = Math.constrain(y - x + r, -255, 255)
    let speedBR = Math.constrain(y + x - r, -255, 255)

    // Execute motor commands
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, speedFL)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, speedFR)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, speedBL)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CW, speedBR)

    basic.pause(20)
})
