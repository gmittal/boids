/**
* Boids Simulation
*/

class Boid {
    constructor() {
        this.position = createVector(windowWidth / 2, windowHeight / 2)
        this.velocity = p5.Vector.random2D()
        this.speed = 2
        this.force = 3e-2
    }

    align() {
        let avg = createVector()
        let total = 0
        for (let b of boids) {
            let d = this.position.dist(b.position)
            if (b != this && d < 25) {
                avg.add(b.velocity)
                total += 1
            }
        }
        if (total > 0) {
            avg.div(total)
            avg.setMag(this.speed)
            avg.sub(this.velocity)
            avg.limit(this.force)
        }
        return avg
    }

    attract() {
        let center = createVector()
        let total = 0
        for (let b of boids) {
            let d = this.position.dist(b.position)
            if (b != this && d < 50) {
                center.add(b.position)
                total += 1
            }
        }
        if (total > 0) {
            center.div(total)
            center.sub(this.position)
            center.setMag(this.maxSpeed)
            center.sub(this.velocity)
            center.limit(this.force)
        }
        return center
    }

    repel() {
        let repulsion = createVector()
        let total = 0
        for (let b of boids) {
            let d = this.position.dist(b.position)
            if (b != this && d < 24) {
                let diff = p5.Vector.sub(this.position, b.position)
                diff.mult(1 / d)
                repulsion.add(diff)
                total += 1
            }
        }
        if (total > 0) {
            repulsion.div(total)
            repulsion.setMag(this.maxSpeed)
            repulsion.sub(this.velocity)
            repulsion.limit(this.force)
        }
        return repulsion
    }

    update() {
        this.velocity.add(this.align())
        this.velocity.add(this.attract())
        this.velocity.add(this.repel().mult(1.5))
        this.position.add(this.velocity)
    }

    render() {
        /* Apply Reynolds' rules */
        this.update()

        /* Keep the boid bounded within the visible window */
        if (this.position.x > windowWidth) this.position.x = 0
        if (this.position.y > windowHeight) this.position.y = 0
        if (this.position.x < 0) this.position.x = windowWidth
        if (this.position.y < 0) this.position.y = windowHeight

        /* Draw boid */
        noStroke()
        ellipse(this.position.x, this.position.y, 5, 5)
    }
}

const boids = []

function setup() {
    createCanvas(windowWidth, windowHeight);

    /* Create the flock */
    for (let i = 0; i < 200; i += 1) {
        boids.push(new Boid())
    }
}

function draw() {
    background(0)
    for (let boid of boids) {
        boid.render()
    }
}

window.onresize = () => { resizeCanvas(windowWidth, windowHeight) }
