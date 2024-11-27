const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

// Firework Object
class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = Math.random() * 3 + 2;
        this.radius = Math.random() * 3 + 2;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.distanceToTarget = Math.hypot(targetX - x, targetY - y);
        this.progress = 0;
        this.exploded = false;
        this.particles = [];
    }

    update() {
        if (!this.exploded) {
            this.progress += this.speed;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            if (this.progress >= this.distanceToTarget) {
                this.exploded = true;
                this.createParticles();
            }
        }

        this.particles.forEach((particle) => particle.update());
        this.particles = this.particles.filter((particle) => particle.alpha > 0);
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'lime';
            ctx.fill();
        }

        this.particles.forEach((particle) => particle.draw());
    }

    createParticles() {
        const shapes = ['circle', 'heart', 'flower', 'star', 'triangle', 'spiral'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
            this.particles.push(new Particle(this.x, this.y, angle, speed, color, shape));
        }
    }
}

// Particle Object
class Particle {
    constructor(x, y, angle, speed, color, shape) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.color = color;
        this.alpha = 1;
        this.size = Math.random() * 4 + 2;
        this.shape = shape;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.speed *= 0.98; // Slows down over time
        this.alpha -= 0.02; // Gradually disappears
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;

        switch (this.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'heart':
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.bezierCurveTo(this.size, -this.size, this.size, this.size, 0, this.size);
                ctx.bezierCurveTo(-this.size, this.size, -this.size, -this.size, 0, -this.size);
                ctx.fill();
                ctx.resetTransform();
                break;

            case 'flower':
                for (let i = 0; i < 6; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        this.x + Math.cos(i * Math.PI / 3) * this.size,
                        this.y + Math.sin(i * Math.PI / 3) * this.size,
                        this.size / 2,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
                break;

            case 'star':
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * Math.PI) / 2.5;
                    const radius = i % 2 === 0 ? this.size * 2 : this.size;
                    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
                }
                ctx.closePath();
                ctx.fill();
                ctx.resetTransform();
                break;

            case 'triangle':
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                for (let i = 0; i < 3; i++) {
                    const angle = (i * Math.PI * 2) / 3;
                    ctx.lineTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
                }
                ctx.closePath();
                ctx.fill();
                ctx.resetTransform();
                break;

            case 'spiral':
                ctx.beginPath();
                for (let i = 0; i < 10; i++) {
                    const radius = i * this.size * 0.5;
                    const angle = i * Math.PI * 0.3;
                    ctx.lineTo(
                        this.x + Math.cos(angle) * radius,
                        this.y + Math.sin(angle) * radius
                    );
                }
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.stroke();
                break;
        }

        ctx.restore();
    }
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Launch fireworks randomly
    if (Math.random() < 0.05) {
        const x = canvas.width / 2; // Center bottom launch
        const y = canvas.height - 20;
        const targetX = Math.random() * canvas.width;
        const targetY = Math.random() * canvas.height / 2;
        fireworks.push(new Firework(x, y, targetX, targetY));
    }

    fireworks.forEach((firework) => firework.update());
    fireworks.forEach((firework) => firework.draw());
    fireworks = fireworks.filter((firework) => firework.particles.length > 0 || !firework.exploded);

    requestAnimationFrame(animate);
}

animate();

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

