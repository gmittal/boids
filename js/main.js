/**
Boids simulation.
Written by Gautam Mittal.
**/

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    /* Euclidian (L2) distance */
    static distance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y)
    }
}

class Boid {
    constructor(pos, v) {
        this.position = pos;
        this.velocity = v;
        this.sprite = new PIXI.Graphics()
        this.sprite.beginFill(0x9966FF)
        this.sprite.drawCircle(0, 0, 10)
        this.sprite.endFill()
        this.sprite.x = pos.x
        this.sprite.y = pos.y
        app.stage.addChild(this.sprite)
    }

    distanceTo(other) {
        return Vector.distance(this.position, other.position)
    }

    move() {
        let neighbors = knn(this, 1)
        this.velocity += averageVelocity(neighbors)
                         + centerOfMass(neighbors) - this.position
                         + avoidOtherBoids(this, neighbors)
        this.position += this.velocity
    }

    draw() {
        this.sprite.x = this.position.x
        this.sprite.y = this.position.y
    }
}

/* Initialize new PIXI application and content window */
let app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight})
app.renderer.view.style.position = "absolute"
app.renderer.view.style.display = "block"
app.renderer.autoResize = true
document.body.appendChild(app.view)

window.addEventListener("resize", () => {
    app.renderer.resize(window.innerWidth, window.innerHeight)
})

/* Create sprite array */
let boids = []

let setup = () => {
    for (var i = 0; i < 10; i += 1) {
        boids[i] = new Boid(new Vector(100*Math.random(), 100*Math.random()),
                            new Vector(100*Math.random(), 100*Math.random()))
    }
}

let gameLoop = () => {
    play()
    requestAnimationFrame(gameLoop)
}

let play = () => {
    boids.forEach((boid) => {
        // boid.move()
        boid.draw()
    });
}

/* Naive KNN implementation */
let knn = (boid, k) => {
    let nearest = []
    while (nearest.length < k && nearest.length < boids.length) {
        let min = 1e100
        boids.forEach((b) => {
            let d = Vector.distance(b.position, boid.position)
            if (b != boid && !(b in nearest) && d < min) {
                min = d
                nearest.push(b)
            }
        })
    }
    console.log(nearest)
    return nearest
}

let averageVelocity = (bs) => {
    let avg = new Vector(0, 0)
    bs.forEach((b) => {
        avg.x += b.velocity.x
        avg.y += b.velocity.y
    })
    avg.x /= bs.length
    avg.y /= bs.length
    return avg
}

let centerOfMass = (bs) => {
    let avg = new Vector(0, 0)
    bs.forEach((b) => {
        avg.x += b.position.x
        avg.y += b.position.y
    })
    avg.x /= bs.length
    avg.y /= bs.length
    return avg
}

let avoidOtherBoids = (boid, bs) => {
    let displacement = new Vector(0, 0)
    bs.forEach((b) => {
        if (b != boid && b.distanceTo(boid) < 1) {
            displacement.x -= (b.x - boid.x)
            displacement.y -= (b.y - boid.y)
        }
    })
    return displacement
}

setup()
gameLoop()
