/**
* Boids Simulation
*/

class Boid {
    constructor() {
        this.position = createVector(100 * Math.random() + 20, 100 * Math.random() + 20)
        this.velocity = createVector(-4 * Math.random() - 0.5, 4 * Math.random() - 0.5)
        this.perception = 10
    }

    align() {
        let avg = createVector()
        for (let b of boids) {
            let d = this.position.dist(b.position)
            if (b != this && d < this.perception)
                avg.add(b.velocity)
        }
        avg.div(boids.length - 1)
        return avg.sub(this.velocity).div(30)
    }

    attract() {
        return createVector(0, 0)
    }

    repel() {
        return createVector(0, 0)
    }

    update() {
        this.velocity.add(this.align())
        this.velocity.add(this.attract())
        this.velocity.add(this.repel())
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
