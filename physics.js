let accelerationX = 0
let accelerationY = 0.35
const collisionDamping = 0.75
const container = document.querySelector("#container")
const wallNudgeDamping = 0.125
const particleNudgeDamping = 0.9

import {gyroscope} from "./gyroscope.js" //change path to location

gyroscope.requestDeviceOrientation()
gyroscope.requestDeviceMotion()

class Particle {
    constructor(radius, element, id) {
        this.radius = radius
        this.element = element
        this.id = id

        const {x, y} = this.getCoordinates(element)
        this.x = x
        this.y = y

        this.velocityX = 0
        this.velocityY = 0

    }   getCoordinates(element) {
        let coordinates = getComputedStyle(element).transform.match(/matrix\(([^)]+)\)/)[1].split(', ')
        return {
            // Gets the x and y coordinates of the element using regex
            x: parseFloat(coordinates[4]),
            y: parseFloat(coordinates[5])
        }

    }   updateVelocities() {
        if (Math.abs(this.velocityX) < 0.01) this.velocityX = 0
        if (Math.abs(this.velocityY) < 0.01) this.velocityY = 0

        // Adds acceleration to the velocity
        this.velocityX += accelerationX
        this.velocityY += accelerationY

    }   checkCollision(particle) {
        const dx = this.x - particle.x
        const dy = this.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
    
        const minDist = this.radius + particle.radius + 5
        if (distance < minDist) {
            const nx = dx / distance
            const ny = dy / distance
            const overlap = minDist - distance
    
            // Nudge each particle away from the other when they're overlapping, more overlap = more explosion
            this.velocityX += (overlap / 2) * nx * particleNudgeDamping
            this.velocityY += (overlap / 2) * ny * particleNudgeDamping
            particle.velocityX -= (overlap / 2) * nx * particleNudgeDamping
            particle.velocityY -= (overlap / 2) * ny * particleNudgeDamping
    
            // Relative velocity
            const rvx = this.velocityX - particle.velocityX
            const rvy = this.velocityY - particle.velocityY
    
            // Relative velocity in normal direction
            const velAlongNormal = rvx * nx + rvy * ny
    
            if (velAlongNormal > 0) return false // already separating
    
            // Impulse scalar for equal mass and perfectly elastic
            const impulse = -velAlongNormal
    
            // Apply impulse to both particles
            this.velocityX += impulse * nx
            this.velocityY += impulse * ny
            particle.velocityX -= impulse * nx
            particle.velocityY -= impulse * ny
    
            // Apply damping
            this.velocityX *= collisionDamping
            this.velocityY *= collisionDamping
            particle.velocityX *= collisionDamping
            particle.velocityY *= collisionDamping
    
            return true
        }
    
        return false
    }

    update() {
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i]

            if (particle.id === this.id) continue // End this loop if particle is checking itself
            else if (this.checkCollision(particle)) break // End entire for loop if collision was detected
        }

        // Collisions with walls
        let containerWidth = container.offsetWidth
        let containerHeight = container.offsetHeight
        if (this.x <= this.radius) { // Detect collision between wall
            const overlap = this.radius - this.x
            if (this.velocityX < 0) { // Switch direction only if velocity direction is to the wall
                this.velocityX = -this.velocityX * collisionDamping
            }
            this.velocityX += overlap * wallNudgeDamping // Make the overlap add velocity, to simulate the walls pushing on the particles if resized mid-simulation
        }
        if (this.y <= this.radius) {
            const overlap = this.radius - this.y
            if (this.velocityY < 0) {
                this.velocityY = -this.velocityY * collisionDamping
            }
            this.velocityY += overlap * wallNudgeDamping
        }
        if (this.x >= containerWidth - this.radius) {
            const overlap = this.x - (containerWidth - this.radius)
            if (this.velocityX > 0) {
                this.velocityX = -this.velocityX * collisionDamping
            }
            this.velocityX -= overlap * wallNudgeDamping
        }
        if (this.y >= containerHeight - this.radius) {
            const overlap = this.y - (containerHeight - this.radius)
            if (this.velocityY > 0) {
                this.velocityY = -this.velocityY * collisionDamping
            }
            this.velocityY -= overlap * wallNudgeDamping
        }
        

        this.updateVelocities()
        this.x += this.velocityX
        this.y += this.velocityY

        this.element.style.transform = `translate(${this.x - this.radius}px, ${this.y - this.radius}px)`
    }
}

// Creating and defining the particles
for (let amount = 0; amount <= 35; amount++) {
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
    document.body.appendChild(svg)
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
    return new Particle(element.clientHeight / 2, element, particleId) // Create a new Particle for each .particle element
})

// Giving each particle a random initial velocity
particles.forEach((particle) => {
    particle.velocityX = Math.random() * 10
    particle.velocityY = Math.random() * 10
})

// Animate one frame
function animate() {
    particles.forEach((particle) => {
        particle.update()
    }) // Update each particle position

    document.querySelector("#text").innerHTML = `Tilt: ${gyroscope.leftToRight}<br>Horizontal: ${gyroscope.movementLeftToRight}<br>Vertical: ${gyroscope.movementUpToDown}`

    requestAnimationFrame(animate)
}   animate() // Start the animation