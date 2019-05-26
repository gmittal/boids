/**
* Boids Simulation
*/

class Boid {
    constructor() {
        this.position = createVector(windowWidth / 2, windowHeight / 2)
        this.velocity = createVector(4 * (Math.random() - 0.5), 4 * (Math.random() - 0.5))
        this.perception = 10
        this.maxSpeed = 1
    }

    align() {
        let avg = createVector()
        let total = 0
        for (let b of boids) {
            let d = this.position.dist(b.position)
            if (b != this && d < this.perception) {
                avg.add(b.velocity)
                total += 1
            }

        }
        avg.div(total)
        return avg.sub(this.velocity).div(100)
    }

    attract() {
        let center = createVector()
        let total = 0
        for (let b of boids) {
            let d = this.position.dist(b.position)
            if (b != this && d < this.perception) {
                center.add(b.position)
                total += 1
            }
        }
        center.div(total)
        return center.sub(this.velocity).div(100)
    }

    repel() {
        let repulsion = createVector()
        for (let b of boids) {
            let d = this.position.dist(b.position)
            if (b != this && d < 10)
                repulsion.sub(b.position.sub(this.position))
        }
        return repulsion.div(100)
    }

    update() {
        // this.velocity.add(this.align())
        this.velocity.add(this.attract())
        // this.velocity.add(this.repel())
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
    for (let i = 0; i < 10; i += 1) {
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
