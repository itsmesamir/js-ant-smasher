const canvas = document.querySelector('canvas');
canvas.width = innerWidth - 45;
canvas.height = innerHeight - 75;
const ctx = canvas.getContext('2d');

const scoreDiv = document.getElementById('score-count');
const antImg = document.getElementById('ant');

let score = 0;
let ants = [];

// ant class 
function Ant(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = 1;
    // this.color = color;
    this.velocity = {
        x: calculateRandomValue(-0.2, 0.8) - 0.5,
        y: calculateRandomValue(-0.2, 0.8) - 0.5,
    }
    this.drawAnt = function() {
        ctx.drawImage(antImg, this.x, this.y, this.radius, this.radius);
    }
    this.antMotion = function(ants) {
        this.drawAnt();
        for (let i = 0; i < ants.length; i++) {
            if (this === ants[i]) continue;

            // rectangular collision 
            if (this.x < ants[i].x + ants[i].radius &&
                this.x + this.radius > ants[i].x &&
                this.y < ants[i].y + ants[i].radius &&
                this.y + this.radius > ants[i].y) {
                collisionDetection(this, ants[i]);
            }
        }
        // reverse on side wall collision
        if (this.x <= 0 || this.x + this.radius >= canvas.width) {
            this.velocity.x = -this.velocity.x;
        }

        if (this.y <= 0 || this.y + this.radius >= canvas.height) {
            this.velocity.y = -this.velocity.y;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
let calculateDistance = function(x1, y1, x2, y2) {
    let horDistance = x2 - x1;
    let vertDistance = y2 - y1;
    return Math.sqrt(Math.pow(horDistance, 2) + Math.pow(vertDistance, 2));
}
let calculateRandomValue = function(value1, value2) {
    return Math.floor(Math.random() * (value2 - value1 + 1) + value1);
}
let init = function() {
    for (let ant = 0; ant < antCount; ant++) {
        let radius = calculateRandomValue(minRadiusOfAnt, maxRadiusOfAnt);
        let x = calculateRandomValue(radius, canvas.width - radius);
        let y = calculateRandomValue(radius, canvas.height - radius);
        // let color = `hsl(${Math.random ()*360}, 60%, 50%)`;
        if (ant !== 0) {
            for (let j = 0; j < ants.length; j++) {
                if (calculateDistance(x, y, ants[j].x, ants[j].y) - (radius + ants[j].radius) < 0) {
                    x = calculateRandomValue(radius, canvas.width - radius);
                    y = calculateRandomValue(radius, canvas.height - radius);
                    j = -1;
                }
            }
        }
        ants.push(new Ant(x, y, radius));
    }
}
const animate = function() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ants.forEach(function(ant) {
        ant.antMotion(ants);
    });
}
canvas.addEventListener('click', (e) => {
    let x = e.clientX;
    let y = e.clientY;
    ants.forEach(function(ant, index) {
        if ((x > ant.x) && (x <= ant.x + (ant.radius * 2)) && (y >= ant.y) && (y <= ant.y + (ant.radius * 2))) {

            ants.splice(index, 1);
            index = undefined;
            score++;
            scoreDiv.innerHTML = score;
        }
    })
});
window.addEventListener('load', function() {
    init();
    animate();
});