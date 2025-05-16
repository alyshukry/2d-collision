
# 💥 Collision Physics
![npm](https://img.shields.io/npm/v/spawn-confetti) ![license](https://img.shields.io/badge/license-MIT-blue.svg) ![downloads](https://img.shields.io/npm/dw/spawn-confetti)

A lightweight and modular 2D physics engine built with vanilla JavaScript.

![Demo](demo.gif)
## 🚀 Installation:
### Option 1: via npm
```bash
npm  install  spawn-confetti
```
### Option 2: Vanilla JS
1. Download `confetti.js` and add it to your project folder
2. Include it in your HTML as a module:
```html
<script  src="path/to/confetti.js"  type="module"></script>
```
## 🎮 Usage and Configuration
### Function Parameters:
The `spawnConfetti()` function has the following parameters:
- **`amount`***`(number)`* – Number of confetti particles to spawn.
	*Default:* 30
	
- **`x, y`***`(number | string)`* – Spawn coordinates.<br>
	*Default:* mouse coordinates<br>
	*Accepted string values*:
	- `mouse` – spawn at mouse coordinate
	- `center` – spawn at center coordinate of page
	- `max` – spawn at max coordinate of page
- **`velXRange, velYRange`***`(array)`* – Initial velocity range.<br>
	*Default:* [-5, 5], [-8, 0]
- **`angVelXRange, angVelZRange`***`(array)`* – Constant rotational velocity range.<br>
	*Default:* [0, 0], [6, 12]
- **`lifetime`***`(number)`* – Lifetime of particles in milliseconds.<br>
	*Default:* 2000

Example:
```js
// Spawn 30 confetti particles at the current mouse position
	spawnConfetti();

// Custom configuration
	spawnConfetti({
		amount: 75,
		x: 'center',
		y: 'max',
		velXRange: [-20, 20],
		velYRange: [-10, -3],
		angVelXRange: [1, 0],
		angVelZRange: [5, 15],
		lifetime: 500
	});
```
### Global Configuration:
There are a few global configurations that you can modify:
- **`acceleration`***`(vector)`* – Controls gravity direction.<br>
	*Default:* (0, 0.25)
	➜ *To edit values, assign like*: `acceleration.x = ...`, `acceleration.y = ...`
- **`maxVel`***`(vector)`* – Sets maximum velocity.<br>
	 *Default*: (1.5, 10)
	➜ *To edit values, assign like*: `maxVel.x = ...`, `maxVel.y = ...`
- **`drag`***`(vector)`* – Affects air resistance. Lower values = more drag.<br>
	 *Default*: (0.98, 1), must be ≤ 1
	➜ *To edit values, assign like*: `drag.x = ...`, `drag.y = ...`
- **`colors`***`(array)`* – List of colors to randomly assign to particles.<br>
	 *Default*: #f44a4a, #fb8f23, #fee440, #7aff60, #00f5d4, #00bbf9, #9b5de5, #f15bb5
- **`shapes`***`(array of svg strings)`* – Shapes for particles to randomly select from.<br>
	 *Default*:
	 ```html
	 <rect x="5" y="0" width="6" height="16"/>,
	<path width="16" height="16" d="M0,12 Q4,4 8,12 Q12,20 16,12" stroke-width="5" fill="none"/>,
	<circle cx="9" cy="9" r="5.5"/>,
	<polygon points="9,2.072 17,15.928 1,15.928"/>
	```
	> ❗ **Note:** When adding new custom SVG shapes, ensure that any `<path>` elements include `fill="none"` to render correctly.

<br>

**License:** MIT
<br>
**Contributing:** Contributions welcome! Please feel free to submit a Pull Request.