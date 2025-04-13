const accelerationX = 0
const accelerationY = 0.0981
const collisionDamping = 0.75
const container = document.querySelector("#container")
const wallNudgeDamping = 0.125
const particleNudgeDamping = 0.5


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
    
        const minDist = this.radius + particle.radius
        if (distance < minDist) {
            const nx = dx / distance
            const ny = dy / distance
            const overlap = minDist - distance
    
            // Nudge each particle away from the other when they're overlapping, more overlap = more explosion
            this.velocityX += (overlap / 2) * nx * particleNudgeDamping
            this.velocityY += (overlap / 2) * ny * particleNudgeDamping
            particle.velocityX -= (overlap / 2) * nx * particleNudgeDamping
            particle.velocityY -= (overlap / 2) * ny* particleNudgeDamping
    
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

        drawPixel(this.x, this.y, 0, 0, 0) // white pixel
        drawPixel(this.x + this.radius, this.y, 255, 0, 0) // red pixel
        drawPixel(this.x, this.y + this.radius, 255, 0, 0) // red pixel
        drawPixel(this.x - this.radius, this.y, 255, 0, 0) // red pixel
        drawPixel(this.x, this.y - this.radius, 255, 0, 0) // red pixel
    }
}

let particleId = -1
const particles = Array.from(document.querySelectorAll(".block")).map((element) => {
    particleId += 1
    console.log(element.firstElementChild.r.baseVal.value)
    return new Particle(element.firstElementChild.r.baseVal.value, element, particleId) // Create a new Particle for each .block element
})

particles.forEach((particle) => {
    particle.velocityX = Math.random() * 10
    particle.velocityY = Math.random() * 10
})

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((particle) => {
        particle.update()
    })  // Update each particle position
    requestAnimationFrame(animate)  // Continue the animation
}

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

function drawPixel(x, y, r, g, b, a = 255) {
    const imageData = ctx.createImageData(1, 1)
    const data = imageData.data

    data[0] = r   // Red
    data[1] = g   // Green
    data[2] = b   // Blue
    data[3] = a   // Alpha

    ctx.putImageData(imageData, Math.floor(x), Math.floor(y))
}

animate()