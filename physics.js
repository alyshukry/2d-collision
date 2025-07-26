class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    set(x, y) {
        if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y !== null && y !== void 0 ? y : this.y;
        }
        return this;
    }
    addToBoth(x, y) {
        if (x instanceof Vector) {
            this.x += x.x;
            this.y += x.y;
        }
        else {
            this.x += x;
            this.y += y !== null && y !== void 0 ? y : this.y;
        }
        return this;
    }
    subtractFromBoth(x, y) {
        if (x instanceof Vector) {
            this.x -= x.x;
            this.y -= x.y;
        }
        else {
            this.x -= x;
            this.y -= y !== null && y !== void 0 ? y : this.y;
        }
        return this;
    }
    abs() {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    normalize() {
        const len = this.magnitude();
        return len === 0 ? new Vector(0, 0) : this.multiply(1 / len);
    }
}
export { Vector };
window.Vector = Vector;
class Particle {
    constructor(r, mass, element, container, id) {
        // Which container this particle belongs to
        this.container = container;
        this.container.acceleration = new Vector(Particle.acceleration.x, Particle.acceleration.y);
        // Particle attributes
        this.r = r;
        this.mass = mass;
        this.element = element;
        this.id = id;
        this.vel = new Vector(Math.random() * 15, Math.random() * 15); // Random initial velocity
        const { x, y } = this.getCoordinates(element);
        this.pos = new Vector(x, y);
    }
    getCoordinates(element) {
        const transform = getComputedStyle(element).transform;
        if (transform === "none") {
            return { x: 0, y: 0 };
        }
        const match = transform.match(/matrix\(([^)]+)\)/);
        if (!match) {
            return { x: 0, y: 0 };
        }
        const coordinates = match[1].split(', ');
        return {
            x: parseFloat(coordinates[4]),
            y: parseFloat(coordinates[5])
        };
    }
    updateVelocities() {
        if (this.vel.abs().magnitude() < 0.01)
            this.vel = this.vel.multiply(0); // Stop particle completely if velocity is low enough
        // Adds Particle.acceleration to the velocity
        this.vel = this.vel.add(this.container.acceleration);
    }
    checkCollision(other) {
        const delta = this.pos.subtract(other.pos);
        const distance = delta.magnitude();
        const minDist = this.r + other.r;
        if (distance < minDist) { // Particles have collided
            const overlap = minDist - distance;
            const correction = delta.normalize().multiply(overlap / 2);
            // Push both particles away from each other
            this.pos = this.pos.add(correction);
            other.pos = other.pos.subtract(correction);
            if (this.vel.abs().magnitude() + other.vel.abs().magnitude() > 0.02) { // If particle has high enough velocity to reduce chaos
                // Physics equation for collision resolution
                const m1 = this.mass;
                const m2 = other.mass;
                const v1 = this.vel;
                const v2 = other.vel;
                const pos1 = this.pos;
                const pos2 = other.pos;
                const deltaVel = v2.subtract(v1);
                const deltaPos = pos2.subtract(pos1);
                const dotProduct = deltaVel.dot(deltaPos);
                const distanceSquared = deltaPos.dot(deltaPos);
                if (distanceSquared === 0)
                    return true; // Avoid division by zero
                const scalar = (2 * m2 / (m1 + m2)) * (dotProduct / distanceSquared);
                const velocityChange = deltaPos.multiply(scalar);
                // Change the particles' velocities
                this.vel = this.vel.add(velocityChange);
                other.vel = other.vel.subtract(velocityChange);
            }
            return true; // There was a collision (For loop should be broken)
        }
        return false;
    }
    update() {
        // Checking each particle with the other and breaking when collision is detected
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            if (particle.container != this.container)
                continue; // End this loop if particle is checking particle in another container
            if (particle.id === this.id)
                continue; // End this loop if particle is checking itself
            else if (this.checkCollision(particle))
                break; // End entire for loop if collision was detected
        }
        // Collisions with walls
        let containerWidth = this.container.element.offsetWidth - Particle.containerPadding;
        let containerHeight = this.container.element.offsetHeight - Particle.containerPadding;
        if (this.pos.x < this.r + Particle.containerPadding) { // Detect collision between wall
            this.pos.x = this.r + Particle.containerPadding; // Move the particle so it isn't touching the wall
            if (this.vel.abs().magnitude() > 0.01)
                this.vel.x = this.vel.multiply(-1).multiply(Particle.collisionDamping).x; // Reverse particle direction
        }
        if (this.pos.x > containerWidth - this.r) {
            this.pos.x = containerWidth - this.r;
            if (this.vel.abs().magnitude() > 0.01)
                this.vel.x = this.vel.multiply(-1).multiply(Particle.collisionDamping).x;
        }
        if (this.pos.y < this.r + Particle.containerPadding) {
            this.pos.y = this.r + Particle.containerPadding;
            if (this.vel.abs().magnitude() > 0.01)
                this.vel.y = this.vel.multiply(-1).multiply(Particle.collisionDamping).y;
        }
        if (this.pos.y > containerHeight - this.r) {
            this.pos.y = containerHeight - this.r;
            if (this.vel.abs().magnitude() > 0.01)
                this.vel.y = this.vel.multiply(-1).multiply(Particle.collisionDamping).y;
        }
        this.updateVelocities();
        this.pos = this.pos.add(this.vel);
        this.element.style.transform = `translate(${this.pos.x - this.r}px, ${this.pos.y - this.r}px)`;
    }
}
Particle.collisionDamping = 0.5;
Particle.enableCursorForce = true;
Particle.cursorForce = .5;
Particle.acceleration = new Vector(0, .35);
Particle.containerPadding = 0;
export { Particle };
window.Particle = Particle;
// Creating and defining the particles
let particleId = 0;
const particles = [];
// Creating a singular particle
function createParticle(radius, mass, element, container) {
    particleId += 1;
    container.element.appendChild(element);
    element.classList.add("particle");
    element.style.position = "absolute";
    if (getComputedStyle(element).transform === "none")
        element.style.transform = "translate(0, 0)";
    const particle = new Particle(radius, mass, element, container, particleId);
    particles.push(particle);
}
export { createParticle };
window.createParticle = createParticle;
// Creating multiple particles
function createParticles(radii, masses, elements, container) {
    elements.forEach((element) => {
        particleId += 1;
        container.element.appendChild(element);
        element.classList.add("particle");
        element.style.position = "absolute";
        if (getComputedStyle(element).transform === "none")
            element.style.transform = "translate(0, 0)";
        const particle = new Particle(radii, masses, element, container, particleId);
        particles.push(particle);
    });
}
export { createParticles };
window.createParticles = createParticles;
export { particles };
window.particles = particles;
// Modify a group of particles by selecting them by their element's class
function editParticles({ particlesClass, setVelX, setVelY, addVelX, addVelY, multiplyVelX, multiplyVelY, setPosX, setPosY, addPosX, addPosY, multiplyPosX, multiplyPosY, setRadii, setMasses, addRadii, addMasses, multiplyRadii, multiplyMasses } = {}) {
    // If user defined the class, select all elements with the class
    if (particlesClass)
        document.querySelectorAll(`.${particlesClass}`).forEach((element) => {
            // Check if the particle's element has the user defined class
            const particle = particles.find((p) => p.element === element);
            if (particle) {
                // Edit the values
                if (setVelX !== undefined)
                    particle.vel.x = setVelX;
                if (setVelY !== undefined)
                    particle.vel.y = setVelY;
                if (addVelX !== undefined)
                    particle.vel.x += addVelX;
                if (addVelY !== undefined)
                    particle.vel.y += addVelY;
                if (multiplyVelX !== undefined)
                    particle.vel.x *= multiplyVelX;
                if (multiplyVelY !== undefined)
                    particle.vel.y *= multiplyVelY;
                if (setPosX !== undefined)
                    particle.pos.x = setPosX;
                if (setPosY !== undefined)
                    particle.pos.y = setPosY;
                if (addPosX !== undefined)
                    particle.pos.x += addPosX;
                if (addPosY !== undefined)
                    particle.pos.y += addPosY;
                if (multiplyPosX !== undefined)
                    particle.pos.x *= multiplyPosX;
                if (multiplyPosY !== undefined)
                    particle.pos.y *= multiplyPosY;
                if (setRadii !== undefined)
                    particle.r = setRadii;
                if (setMasses !== undefined)
                    particle.mass = setMasses;
                if (addRadii !== undefined)
                    particle.r += addRadii;
                if (addMasses !== undefined)
                    particle.mass += addMasses;
                if (multiplyRadii !== undefined)
                    particle.r *= multiplyRadii;
                if (multiplyMasses !== undefined)
                    particle.mass *= multiplyMasses;
            }
        });
    else
        console.error("No class defined. Please provide a valid 'particlesClass' to select the particles you want to edit.");
}
export { editParticles };
window.editParticles = editParticles;
// Animate one frame
function animate() {
    particles.forEach((particle) => {
        particle.update();
    }); // Update each particle position
    requestAnimationFrame(animate);
}
animate(); // Start the animation
let currentMouseX, currentMouseY;
let holdClickInterval;
let saveAcceleration = new Vector(0, 0);
let container;
// Initial mouse or touch down - start tracking
function startTracking(event) {
    if (event.target instanceof HTMLElement) {
        container = {
            element: event.target,
            acceleration: new Vector(0, 0)
        };
    }
    else
        return;
    if (event instanceof TouchEvent) {
        currentMouseX = event.touches[0].clientX;
        currentMouseY = event.touches[0].clientY;
    }
    else if (event instanceof MouseEvent) {
        currentMouseX = event.clientX;
        currentMouseY = event.clientY;
    }
    saveAcceleration.x = container.acceleration.x;
    saveAcceleration.y = container.acceleration.y;
    // Start the interval to log the current position
    if (Particle.enableCursorForce)
        holdClickInterval = setInterval(() => {
            particles.forEach((particle) => {
                console.log(container, particle.container);
                if (particle.container.element === container.element) {
                    console.log("hallo");
                    const containerRect = container.element.getBoundingClientRect();
                    container.element.style.cursor = "grabbing"; // Override CSS
                    document.body.style.cursor = "grabbing";
                    const mouseX = currentMouseX - containerRect.left;
                    const mouseY = currentMouseY - containerRect.top;
                    if (particle.pos.x > mouseX)
                        particle.vel.x -= Particle.cursorForce * (particle.pos.x - mouseX) / (Math.pow(particle.r, 1.5));
                    if (particle.pos.x < mouseX)
                        particle.vel.x += Particle.cursorForce * (mouseX - particle.pos.x) / (Math.pow(particle.r, 1.5));
                    if (particle.pos.y > mouseY)
                        particle.vel.y -= Particle.cursorForce * (particle.pos.y - mouseY) / (Math.pow(particle.r, 1.5));
                    if (particle.pos.y < mouseY)
                        particle.vel.y += Particle.cursorForce * (mouseY - particle.pos.y) / (Math.pow(particle.r, 1.5));
                }
            });
            container.acceleration.set(0, 0);
        }, 50);
}
// Update position as mouse or touch moves
function updatePosition(event) {
    if (event instanceof TouchEvent) {
        const clientX = event.touches[0].clientX;
        const clientY = event.touches[0].clientY;
        currentMouseX = clientX;
        currentMouseY = clientY;
    }
    else if (event instanceof MouseEvent) {
        const clientX = event.clientX;
        const clientY = event.clientY;
        currentMouseX = clientX;
        currentMouseY = clientY;
    }
}
// Stop tracking when mouse or touch is released
function stopTracking() {
    clearInterval(holdClickInterval);
    // Check if container has acceleration property to avoid annoying console error
    if (container && container.acceleration)
        container.acceleration.set(saveAcceleration.x, saveAcceleration.y);
    else
        return;
    // Restore defaults
    container.element.style.cursor = "grab";
    document.body.style.cursor = "auto";
}
// Add event listeners for both mouse and touch events
document.addEventListener("mousedown", startTracking);
document.addEventListener("touchstart", startTracking);
document.addEventListener("mousemove", updatePosition);
document.addEventListener("touchmove", updatePosition);
document.addEventListener("mouseup", stopTracking);
document.addEventListener("touchend", stopTracking);
