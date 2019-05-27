/**
* Boids Simulation
*/

class Boid {
    constructor() {
        this.position = createVector(windowWidth / 2, windowHeight / 2)
        this.velocity = p5.Vector.random2D()
        this.speed = 4
        this.force = 3e-2
    }

    align() {
        let avg = createVector()
        let n = 0
        for (let b of this.neighbors(50)) {
            avg.add(b.velocity)
            n += 1
        }
        return this.normalize(avg, n)
    }

    attract() {
        let center = createVector()
        let n = 0
        for (let b of this.neighbors(50)) {
            center.add(b.position)
            n += 1
        }
        return this.normalize(center, n)
    }

    repel() {
        let repulsion = createVector()
        let n = 0
        for (let b of this.neighbors(24)) {
            let diff = p5.Vector.sub(this.position, b.position)
            diff.mult(1 / (diff.mag() + 1))
            repulsion.add(diff)
            n += 1
        }
        return this.normalize(repulsion, n)
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
        ellipse(this.position.x, this.position.y, 10, 10)
    }

    /* Normalize vectors according to Reynolds' rules */
    normalize(v, n) {
        let u = v.copy()
        if (n > 0) {
            u = p5.Vector.div(u, n)
            u.setMag(this.maxSpeed)
            u.sub(this.velocity)
            u.limit(this.force)
        }
        return u
    }

    /* Naive nearest neighbors */
    neighbors(radius) {
        let bs = []
        for (let b of boids)
            if (b != this && this.position.dist(b.position) < radius)
                bs.push(b)
        return bs
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

window.onresize = () => { resizeCanvas(windowWidth - 5, windowHeight - 5) }
