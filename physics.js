
import {gyroscope} from "./gyroscope.js"
import {Vector} from "./vectors.js"

let acceleration = new Vector(0, 0.35) 

const collisionDamping = 0.5
const container = document.querySelector("#container")
let containerWidth = container.offsetWidth
let containerHeight = container.offsetHeight
let containerRect = container.getBoundingClientRect()

let click = document.querySelector("body")
click.onclick = function(){
    gyroscope.requestDeviceOrientation()
    gyroscope.requestDeviceMotion()
    console.log("Requesting permissions...")
}

class Particle {
    constructor(r, mass, element, id) {
        // Particle attributes
        this.r = r
        this.mass = mass
        this.element = element
        this.id = id
        this.element.id = `particle-${id}`
        this.vel =  new Vector(Math.random() * 15, Math.random() * 15) // Random initial velocity

        const {x, y} = this.getCoordinates(element)
        this.pos = new Vector(x, y)


    }   getCoordinates(element) { // Gets the particle's coordinates from the element's transform
        let coordinates = getComputedStyle(element).transform.match(/matrix\(([^)]+)\)/)[1].split(', ')
        return {
            // Gets the x and y coordinates of the element using regex
            x: parseFloat(coordinates[4]),
            y: parseFloat(coordinates[5])
        }

    }   updateVelocities() {
        if (this.vel.abs().magnitude() < 0.01) this.vel = this.vel.multiply(0) // Stop particle completely if velocity is low enough

        // Adds acceleration to the velocity
        if (gyroscope.frontToBack) { // Check if gyro is enabled
            this.vel.x += gyroscope.leftToRight / 180 + gyroscope.movementLeftToRight / 2.5
            this.vel.y += gyroscope.frontToBack / 180 + gyroscope.movementUpToDown / 2.5

        } else {
            this.vel = this.vel.add(acceleration)
        }   

    }   checkCollision(other) { // Runs for each particle pair (unless a collision is detected, then it stops looking for other pairs)
        const delta = this.pos.subtract(other.pos)
        const distance = delta.magnitude()
        const minDist = this.r + other.r
        
        if (distance < minDist) { // Particles have collided
            const overlap = minDist - distance
            const correction = delta.normalize().multiply(overlap / 2)
        
            // Push both particles away from each other
            this.pos = this.pos.add(correction)
            other.pos = other.pos.subtract(correction)

            if (this.vel.abs().magnitude() + other.vel.abs().magnitude() > 0.02) { // If particle has high enough velocity to reduce chaos
                // Physics equation for collision resolution
                const m1 = this.mass
                const m2 = other.mass
                const v1 = this.vel
                const v2 = other.vel
                const pos1 = this.pos
                const pos2 = other.pos
            
                const deltaVel = v2.subtract(v1)
                const deltaPos = pos2.subtract(pos1)
            
                const dotProduct = deltaVel.dot(deltaPos)
                const distanceSquared = deltaPos.dot(deltaPos)
            
                if (distanceSquared === 0) return v1 // Avoid division by zero
            
                const scalar = (2 * m2 / (m1 + m2)) * (dotProduct / distanceSquared)
                const velocityChange = deltaPos.multiply(scalar)
            
                // Change the particles' velocities
                this.vel = this.vel.add(velocityChange)
                other.vel = other.vel.subtract(velocityChange)

            }   return true // There was a collision (For loop should be broken)

        }   return false
    }

    update() {
        // Checking each particle with the other and breaking when collision is detected
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i]

            if (particle.id === this.id) continue // End this loop if particle is checking itself
            else if (this.checkCollision(particle)) break // End entire for loop if collision was detected
        }

        // Collisions with walls        
        if (this.pos.x < this.r) { // Detect collision between wall
            this.pos.x = this.r // Move the particle so it isn't touching the wall
            if (this.vel.abs().magnitude() > 0.01) this.vel.x = this.vel.multiply(-1).multiply(collisionDamping).x // Reverse particle direction

        }   if (this.pos.x > containerWidth - this.r) {
            this.pos.x = containerWidth - this.r
            if (this.vel.abs().magnitude() > 0.01) this.vel.x = this.vel.multiply(-1).multiply(collisionDamping).x

        }   if (this.pos.y < this.r) {
            this.pos.y = this.r
            if (this.vel.abs().magnitude() > 0.01) this.vel.y = this.vel.multiply(-1).multiply(collisionDamping).y

        }   if (this.pos.y > containerHeight - this.r) {
            this.pos.y = containerHeight - this.r
            if (this.vel.abs().magnitude() > 0.01) this.vel.y = this.vel.multiply(-1).multiply(collisionDamping).y
        }

        this.updateVelocities()
        this.pos = this.pos.add(this.vel)

        this.element.style.transform = `translate(${this.pos.x - this.r}px, ${this.pos.y - this.r}px)` // Radius offset to display particles correctly
    }
}

// Creating and defining the particles
for (let amount = 0; amount < 20; amount++) {
    const svgNS = "http://www.w3.org/2000/svg"

    const svg = document.createElementNS(svgNS, "svg")
    svg.setAttribute("class", "particle")
    svg.setAttribute("width", "48px")
    svg.setAttribute("height", "48px")
    svg.setAttribute("xmlns", svgNS)

    const circle = document.createElementNS(svgNS, "circle")
    circle.setAttribute("cx", "24")
    circle.setAttribute("cy", "24")
    circle.setAttribute("r", "24")
    circle.setAttribute("fill", "currentColor")

    svg.appendChild(circle)
    container.appendChild(svg)
}   const particleElements = document.querySelectorAll(".particle")

// Separating the particles
let initialPos = 0
document.querySelectorAll(".particle").forEach((particleElement) => {
    initialPos += particleElement.clientHeight + 5
    particleElement.style.transform = `translate(${initialPos}px, 50px)`
})

// Creating the particles
let particleId = -1
const particles = Array.from(particleElements).map((element) => {
    particleId += 1
    return new Particle(element.clientHeight / 2, 1, element, particleId) // Create a new Particle for each .particle element
})

// Animate one frame
function animate() {
    particles.forEach((particle) => {
        particle.update()
    }) // Update each particle position

    if (gyroscope.frontToBack) document.querySelector("#text").innerHTML = `
        Beta: ${gyroscope.frontToBack?.toFixed(2) ?? "N/A"},<br>
        Gamma: ${gyroscope.leftToRight?.toFixed(2) ?? "N/A"},<br>
        X: ${gyroscope.movementLeftToRight?.toFixed(2) ?? "N/A"},<br>
        Y: ${gyroscope.movementUpToDown?.toFixed(2) ?? "N/A"}<br>
    `
    requestAnimationFrame(animate)

}   animate() // Start the animation

let currentMouseX, currentMouseY
let holdClickInterval
let saveAcceleration = {...acceleration}
// Initial mouse down - start tracking
container.addEventListener('mousedown', function(event) {
    // Set initial position
    currentMouseX = event.clientX
    currentMouseY = event.clientY
    
    saveAcceleration.x = acceleration.x
    saveAcceleration.y = acceleration.y
    // Start the interval to log the current position
    holdClickInterval = setInterval(() => {
        particles.forEach((particle) => { // Accelerate particles towards mouse
            if (particle.pos.x > currentMouseX - containerRect.left) particle.vel.x -= .5
            if (particle.pos.x < currentMouseX - containerRect.left) particle.vel.x += .5
            if (particle.pos.y > currentMouseY - containerRect.top) particle.vel.y -= .5
            if (particle.pos.y < currentMouseY - containerRect.top) particle.vel.y += .5
        })
        acceleration.set(0, 0)
    }, 50)
})
// Update position as mouse moves
document.addEventListener('mousemove', function(event) {
    // Update the current position variables
    currentMouseX = event.clientX
    currentMouseY = event.clientY
})
// Stop tracking when mouse is released
document.addEventListener('mouseup', function() {
    clearInterval(holdClickInterval)
    acceleration.set(saveAcceleration.x, saveAcceleration.y)
})