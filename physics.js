
import {gyroscope} from "./gyroscope.js"
import {Vector} from "./vectors.js"

let acceleration = new Vector(0, 0.35) 

const collisionDamping = 0.8
const container = document.querySelector("#container")

gyroscope.requestDeviceOrientation()
gyroscope.requestDeviceMotion()

let click = document.querySelector("body");
click.onclick = function(){
    gyroscope.requestDeviceOrientation()
    gyroscope.requestDeviceMotion()
    console.log("Requesting permissions...")};

class Particle {
    constructor(r, element, id) {
        this.r = r
        this.element = element
        this.id = id

        const {x, y} = this.getCoordinates(element)
        this.pos = new Vector(x, y)

        this.vel =  new Vector(0, 0)

    }   getCoordinates(element) {
        let coordinates = getComputedStyle(element).transform.match(/matrix\(([^)]+)\)/)[1].split(', ')
        return {
            // Gets the x and y coordinates of the element using regex
            x: parseFloat(coordinates[4]),
            y: parseFloat(coordinates[5])
        }

    }   updateVelocities() {
        if (this.vel.abs().magnitude() < 0.01) this.vel = this.vel.multiply(0)

        // Adds acceleration to the velocity
        if (gyroscope.frontToBack) {
            this.vel.x += (gyroscope.rotateDisplay - 180) / 360

        } else {
            this.vel = this.vel.addToBoth(acceleration)
        }   

    }   checkCollision(other) {
        const delta = this.pos.subtract(other.pos)
        const distance = delta.magnitude()
        const minDist = this.r + other.r
        
        if (distance < minDist) {
            const overlap = minDist - distance
            const correction = delta.normalize().multiply(overlap / 2)
        
            // Push both particles away from each other
            this.pos = this.pos.add(correction)
            other.pos = other.pos.subtract(correction)

            if (this.vel.abs().magnitude() + other.vel.abs().magnitude() > 0.02) {
                const m1 = 1
                const m2 = 1
            
                const v1 = this.vel
                const v2 = other.vel
            
                const x1 = this.pos
                const x2 = other.pos
            
                const deltaV = v2.subtract(v1)
                const deltaX = x2.subtract(x1)
            
                const dotProduct = deltaV.dot(deltaX)
                const distanceSquared = deltaX.dot(deltaX)
            
                if (distanceSquared === 0) return v1 // Avoid divide by zero
            
                const scalar = (2 * m2 / (m1 + m2)) * (dotProduct / distanceSquared)
                const velocityChange = deltaX.multiply(scalar)
            
                this.vel = this.vel.add(velocityChange)
            other.vel = other.vel.subtract(velocityChange)
            }

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
        
        if (this.pos.x <=this.r) { // Detect collision between wall
            this.pos.x = this.r
            if (this.vel.abs().magnitude() > 0.01) this.vel.x = this.vel.multiply(-1).multiply(collisionDamping).x

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

        this.element.style.transform = `translate(${this.pos.x - this.r}px, ${this.pos.y - this.r}px)`
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
    return new Particle(element.clientHeight / 2, element, particleId) // Create a new Particle for each .particle element
})

// Giving each particle a random initial velocity
particles.forEach((particle) => {
    particle.vel.x = Math.random() * 10
    particle.vel.y = Math.random() * 10
})

// Animate one frame
function animate() {
    particles.forEach((particle) => {
        particle.update()
    }) // Update each particle position

    if (gyroscope.frontToBack) document.querySelector("#text").innerHTML = `
        Alpha: ${Math.sin(gyroscope.rotateDisplay?.toFixed(2) - 180) / 5 ?? "N/A"},<br>
        Beta: ${gyroscope.frontToBack?.toFixed(2) ?? "N/A"},<br>
        Gamma: ${gyroscope.leftToRight?.toFixed(2) ?? "N/A"},<br>
        X: ${gyroscope.movementLeftToRight?.toFixed(2) ?? "N/A"},<br>
        Y: ${gyroscope.movementUpToDown?.toFixed(2) ?? "N/A"}<br>
    `
    requestAnimationFrame(animate)

}   animate() // Start the animation