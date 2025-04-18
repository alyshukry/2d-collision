export class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y)

    }   subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y)

    }   multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar)

    }   set(x, y) {
        if (x instanceof Vector) {
            this.x = x.x
            this.y = x.y

        }   else {
            this.x = x
            this.y = y
        }
        return this

    }   addToBoth(x, y) {
        if (x instanceof Vector) {
            this.x += x.x
            this.y += x.y

        }   else {
            this.x += x
            this.y += y
        }
        return this

    }   subtractFromBoth(x, y) {
        if (x instanceof Vector) {
            this.x -= x.x
            this.y -= x.y

        }   else {
            this.x -= x
            this.y -= y
        }
        return this

    }   abs() {
            return new Vector(Math.abs(this.x), Math.abs(this.y))

    }   dot(v) {
        return this.x * v.x + this.y * v.y

    }   magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)

    }   normalize() {
        const len = this.magnitude()
        return len === 0 ? new Vector(0, 0) : this.multiply(1 / len)
    }
}