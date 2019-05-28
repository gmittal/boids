/**
 * Boids Simulation
 * Written by Gautam Mittal
*/

class Boid {
    constructor() {
        this.position = createVector(windowWidth / 2, windowHeight / 2)
        this.velocity = p5.Vector.random2D()
        this.speed = 2
        this.force = 3e-2
    }

    /* Match neighbors' average velocity */
    align() {
        return this.rule(25, false, (v, other) => {
            v.add(other.velocity)
        })
    }

    /* Move towards neighbors' center of mass */
    attract() {
        return this.rule(50, true, (v, other) => {
            v.add(other.position)
        })
    }

    /* Don't overcrowd neighbors */
    repel() {
        return this.rule(24, false, (v, other) => {
            let diff = p5.Vector.sub(this.position, other.position)
            diff.mult(1 / (diff.mag() + 1))
            v.add(diff)
        })
    }

    update() {
        this.velocity.add(this.align())
        this.velocity.add(this.attract())
        this.velocity.add(this.repel().mult(1.5))
        this.position.add(this.velocity)
    }

    render() {
        /* Apply Reynolds' rules */
        let currentPos = this.position
        this.update()

        /* Keep the boid bounded within the visible window */
        if (this.position.x > windowWidth) this.position.x = 0
        if (this.position.y > windowHeight) this.position.y = 0
        if (this.position.x < 0) this.position.x = windowWidth
        if (this.position.y < 0) this.position.y = windowHeight

        tree.insert(this.position)
        tree.remove(currentPos)

        /* Draw boid */
        fill(0)
        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading() + radians(90));
        beginShape(TRIANGLES);
        vertex(0, -1.5*2);
        vertex(-1.5, 1.5*2);
        vertex(1.5, 1.5*2);
        endShape();
        pop();
    }

    /* General swarm heuristic HOF */
    rule(radius, normPos, fn) {
        let avg = createVector()
        let nearest = this.neighbors(radius)
        for (let b of nearest) fn(avg, b)
        return this.normalize(avg, nearest.length, normPos)
    }

    /* Normalize vector norms */
    normalize(v, n, normPos) {
        let u = v.copy()
        if (n > 0) {
            u = p5.Vector.div(u, n)
            if (normPos) u.sub(this.position)
            u.setMag(this.speed)
            u.sub(this.velocity)
            u.limit(this.force)
        }
        return u
    }

    /* L2 distance */
    static distance(boid, other) {
        return boid.position.dist(other.position)
    }

    /* (Naive) nearest neighbors */
    neighbors(radius) {
        let bs = []
        for (let b of boids)
            if (b != this && Boid.distance(this, b) < radius)
                bs.push(b)
        return bs
    }

    /* (Fast) nearest neighbors */
    knn(k, radius) {

    }

}

const distance = (a, b) => {
  return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2)
}

const points = () => {
    let p = []
    for (let b of boids) p.push(b.position)
    return p
}

const boids = []
let tree = new kdTree(points(), distance, ['x', 'y'])

function setup() {
    createCanvas(windowWidth - 5, windowHeight - 5)

    /* Create the flock */
    for (let i = 0; i < 400; i += 1) {
        let boid = new Boid()
        tree.insert(boid.position)
        boids.push(boid)
    }
}

function draw() {
    background(255)
    tree = new kdTree(points(), distance, ['x', 'y'])
    for (let boid of boids) {
        boid.render()
    }
}

window.onresize = () => { resizeCanvas(windowWidth - 5, windowHeight - 5) }
