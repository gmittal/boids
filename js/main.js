/**
Boids simulation.
Written by Gautam Mittal.
**/

/* Initialize new PIXI application */
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
    for (var i = 0; i < 100; i += 1) {
        let circle = new PIXI.Graphics();
        circle.beginFill(0x9966FF)
        circle.drawCircle(0, 0, 12)
        circle.endFill()
        circle.x = i*44
        circle.y = 130
        boids[i] = circle
        app.stage.addChild(circle)
    }
}

let gameLoop = () => {
    // Game drawing and updates go here
    boids.forEach((boid) => {
        boid.x += 10 * (Math.random() - 0.5);
        boid.y += 10 * (Math.random() - 0.5);
    })
    requestAnimationFrame(gameLoop)
}

let play = (delta) => {
    // Game logic goes here
}

setup()
gameLoop()
