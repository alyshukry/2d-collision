# ⚙️ Particle Physics Simulation
![npm](https://img.shields.io/npm/v/particle-physics-sim) ![license](https://img.shields.io/badge/license-MIT-blue.svg) ![downloads](https://img.shields.io/npm/dw/particle-physics-sim)

A lightweight and customizable JavaScript library for simulating particle physics, including collisions, gravity, and interactive forces. Perfect for creating dynamic visual effects.

![Demo](demo.gif)
## 🚀 Installation:
### Option 1: via npm
```bash
npm install 2d-collision
```
### Option 2: Vanilla JS
1. Download `physics.js` and add it to your project folder.
2. Include it in your HTML as a module:
```html
<script src="path/to/physics.js" type="module"></script>
```
## 🎮 Usage and Configuration
### Functions:
The library provides the following key functions:
- **`createParticle(radius, mass, element, container)`** – Creates a single particle and adds it to the simulation.

    - `radius`*`(number)`* – determines particle's size
    - `mass`*`(number)`* – determines particle's weight
    - `element`*`(string)`* – the HTML element that you'd like to turn into a particle
    - `container`*`(string)`* – the HTML element that you'd like to act as the container for the particle
- **`createParticles(radii, masses, elements, container)`** – Creates multiple particles at once.
- **`editParticles()`** – Modify properties of particles by selecting them via their class. Function provides the following arguments:
    - **`particlesClass`** *(string)* – The class of the HTML elements representing the particles.
    
    - **`setVelX, setVelY`** *(number)* – Sets the velocity of the particles along the X and Y axes.
    - **`addVelX, addVelY`** *(number)* – Adds to the current velocity of the particles along the X and Y axes.
    - **`multiplyVelX, multiplyVelY`** *(number)* – Multiplies the current velocity of the particles along the X and Y axes.
    - **`setPosX, setPosY`** *(number)* – Sets the position of the particles along the X and Y axes.
    - **`addPosX, addPosY`** *(number)* – Adds to the current position of the particles along the X and Y axes.
    - **`multiplyPosX, multiplyPosY`** *(number)* – Multiplies the current position of the particles along the X and Y axes.
    - **`setRadii`** *(number)* – Sets the radii of the particles.
    - **`addRadii`** *(number)* – Adds to the current radii of the particles.
    - **`multiplyRadii`** *(number)* – Multiplies the current radii of the particles.
    - **`setMasses`** *(number)* – Sets the masses of the particles.
    - **`addMasses`** *(number)* – Adds to the current masses of the particles.
    - **`multiplyMasses`** *(number)* – Multiplies the current masses of the particles.
Example:
```js
// Create a single particle
createParticle(10, 1, document.querySelector('#circle'), document.querySelector('#container'));

// Create multiple particles
createParticles(12, 3, document.querySelectorAll('.circle'), document.querySelector('#container'));

// Edit particles
editParticles({
    particlesClass: 'circle',
    setVelX: 5,
    addPosY: 10,
    multiplyRadii: 1.5
});
```
### Global Configuration:
The library includes several global settings to control particle behavior:
- **`Particle.acceleration`** *(Vector)* – Controls gravity direction.<br>
    *Default:* (0, 0.35)<br>
    ➜ *To edit values, assign like*: `Particle.acceleration.x = ...`, `Particle.acceleration.y = ...`
- **`Particle.collisionDamping`** *(number)* – Reduces velocity after collisions.<br>
    *Default:* 0.5
- **`Particle.enableCursorForce`** *(boolean)* – Enables or disables interactive forces from the cursor.<br>
    *Default:* true
- **`Particle.cursorForce`** *(number)* – Strength of the cursor's interactive force.<br>
    *Default:* 0.5

### Interactive Features:
- **Mouse Interaction:** Hold and drag on the screen to apply forces to particles.
- **Collision Detection:** Particles collide with each other and container walls, with realistic physics.

<br>

**License:** MIT  
**Contributing:** Contributions welcome! Please feel free to submit a Pull Request.