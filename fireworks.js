const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

// Resize Canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Firework Object
class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = Math.random() * 8 + 2;
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
            const color = `hsl(${Math.random() * 360}, 100%, 60%)`; // Fixed color format
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
        this.alpha -= 0.01; // Gradually disappears
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

            case 'square':
                ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
                break;

            case 'rectangle':
                ctx.fillRect(this.x - this.size, this.y - this.size / 2, this.size * 2, this.size);
                break;

            case 'triangle':
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                for (let i = 0; i < 3; i++) {
                    const angle = (i * Math.PI * 2) / 3;
                    ctx.lineTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;

            case 'oval':
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.scale(1.5, 1); // Scale to make it an oval
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;

            case 'pentagon':
            case 'hexagon':
            case 'heptagon':
            case 'octagon':
            case 'nonagon':
            case 'decagon':
                const sides = {
                    pentagon: 5,
                    hexagon: 6,
                    heptagon: 7,
                    octagon: 8,
                    nonagon: 9,
                    decagon: 10,
                }[this.shape];
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                for (let i = 0; i < sides; i++) {
                    const angle = (i * Math.PI * 2) / sides;
                    ctx.lineTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;

            case 'ellipse':
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.scale(1, 0.6); // Adjust scale to create an ellipse
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;

            case 'rhombus':
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size, 0);
                ctx.lineTo(0, this.size);
                ctx.lineTo(-this.size, 0);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;

            case 'trapezoid':
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                ctx.moveTo(-this.size, -this.size / 2);
                ctx.lineTo(this.size, -this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;

            case 'parallelogram':
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                ctx.moveTo(-this.size, -this.size / 2);
                ctx.lineTo(this.size, -this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.lineTo(-this.size * 1.5, this.size / 2);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;

            case 'kite':
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size / 1.5, 0);
                ctx.lineTo(0, this.size);
                ctx.lineTo(-this.size / 1.5, 0);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;

            case 'rhomboid':
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                ctx.moveTo(-this.size, -this.size / 2);
                ctx.lineTo(this.size, -this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.lineTo(-this.size * 1.5, this.size / 2);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;

            case 'star':
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * Math.PI * 2) / 5;
                    const outerRadius = this.size * 2;
                    const innerRadius = this.size;
                    ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
                    ctx.lineTo(
                        Math.cos(angle + Math.PI / 5) * innerRadius,
                        Math.sin(angle + Math.PI / 5) * innerRadius
                    );
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;

            case 'crescent':
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0.3 * Math.PI, 1.7 * Math.PI, false);
                ctx.arc(-this.size / 2, 0, this.size * 0.8, 0.3 * Math.PI, 1.7 * Math.PI, true);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;


            case 'heart':
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.bezierCurveTo(
                    this.size, -this.size,
                    this.size, this.size,
                    0, this.size
                );
                ctx.bezierCurveTo(
                    -this.size, this.size,
                    -this.size, -this.size,
                    0, -this.size
                );
                ctx.fill();
                ctx.restore();
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


            // 3D from here 
            case 'prism':
                // Draw a simple rectangular prism (3D projection)
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                ctx.moveTo(-this.size, -this.size);
                ctx.lineTo(this.size, -this.size);
                ctx.lineTo(this.size, this.size);
                ctx.lineTo(-this.size, this.size);
                ctx.closePath();
                ctx.stroke(); // Front face
                ctx.moveTo(-this.size, -this.size);
                ctx.lineTo(-this.size / 2, -this.size * 1.5); // Projection to back face
                ctx.moveTo(this.size, -this.size);
                ctx.lineTo(this.size / 2, -this.size * 1.5);
                ctx.moveTo(this.size, this.size);
                ctx.lineTo(this.size / 2, this.size * 1.5);
                ctx.moveTo(-this.size, this.size);
                ctx.lineTo(-this.size / 2, this.size * 1.5);
                ctx.stroke();
                ctx.restore();
                break;

            case 'octahedron':
                // Draw a simple octahedron (3D projection)
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size, 0);
                ctx.lineTo(0, this.size);
                ctx.lineTo(-this.size, 0);
                ctx.closePath(); // Top pyramid base
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(0, this.size); // Vertical line
                ctx.stroke();
                ctx.restore();
                break;

            case 'tetrahedron':
                // Draw a simple tetrahedron (3D projection)
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size, this.size);
                ctx.lineTo(-this.size, this.size);
                ctx.closePath(); // Base of tetrahedron
                ctx.stroke();
                ctx.moveTo(0, -this.size);
                ctx.lineTo(0, this.size);
                ctx.stroke();
                ctx.restore();
                break;

            case 'dodecahedron':
                // Draw a simple dodecahedron (3D projection)
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                for (let i = 0; i < 12; i++) {
                    const angle = (i * Math.PI * 2) / 12;
                    ctx.lineTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
                }
                ctx.closePath(); // Outer edge of the dodecahedron
                ctx.stroke();
                ctx.restore();
                break;

            case 'octadecagon': // 18-sided polygon
                ctx.beginPath();
                for (let i = 0; i < 18; i++) {
                    const angle = (i * Math.PI * 2) / 18;
                    ctx.lineTo(this.x + Math.cos(angle) * this.size, this.y + Math.sin(angle) * this.size);
                }
                ctx.closePath();
                ctx.fill();
                break;

            case 'enneadecagon': // 19-sided polygon
                ctx.beginPath();
                for (let i = 0; i < 19; i++) {
                    const angle = (i * Math.PI * 2) / 19;
                    ctx.lineTo(this.x + Math.cos(angle) * this.size, this.y + Math.sin(angle) * this.size);
                }
                ctx.closePath();
                ctx.fill();
                break;

            case 'icosagon': // 20-sided polygon
                ctx.beginPath();
                for (let i = 0; i < 20; i++) {
                    const angle = (i * Math.PI * 2) / 20;
                    ctx.lineTo(this.x + Math.cos(angle) * this.size, this.y + Math.sin(angle) * this.size);
                }
                ctx.closePath();
                ctx.fill();
                break;

            case 'crescent':
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0.3 * Math.PI, 1.7 * Math.PI, false); // Large arc for the crescent
                ctx.arc(-this.size / 2, 0, this.size * 0.8, 0.3 * Math.PI, 1.7 * Math.PI, true); // Small arc
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                break;

            default:
                console.error(`Shape "${this.shape}" not recognized.`);
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

// Disable right-click
document.addEventListener('contextmenu', (e) => e.preventDefault());


// ANGEL ANIMATION FORM HERE
 // Show "ANGEL" logo on double-click
 document.body.addEventListener('dblclick', () => {
    const angelLogo = document.getElementById('angelLogo');
    
    // Reset the logo's visibility and opacity to make sure it starts fresh
    angelLogo.style.visibility = 'visible';
    angelLogo.style.opacity = '1';
    
    // Trigger the fade-in effect with transition
    angelLogo.style.transition = 'opacity 2s ease-in-out';
    
    // Fade out and hide the logo after 5 seconds
    setTimeout(() => {
      angelLogo.style.opacity = '0';
      angelLogo.style.transition = 'opacity 2s ease-in-out';  // Optional: you can keep transition for fade-out as well
    }, 3000); // Keep visible for 3 seconds before fading out
  
    setTimeout(() => {
      angelLogo.style.visibility = 'hidden';  // Hide the logo after it fades out
    }, 5000); // Hide after 5 seconds
  });
  
  // Show "ANGEL" logo on double-click or double-tap
let clickTimeout;

function showAngelLogo() {
  const angelLogo = document.getElementById('angelLogo');
  angelLogo.style.visibility = 'visible';
  angelLogo.style.opacity = '1';

  // Triggering animation for fade-in and letter-by-letter entry
  angelLogo.style.transition = 'opacity 2s ease-in-out';

  setTimeout(() => {
    angelLogo.style.visibility = 'hidden';
  }, 5000); // Hide logo after 5 seconds
}

// Handle double-click for desktop
document.body.addEventListener('dblclick', showAngelLogo);

// Handle double-tap for mobile
document.body.addEventListener('touchstart', function (e) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    showAngelLogo();
  } else {
    clickTimeout = setTimeout(function () {
      clickTimeout = null;
    }, 300); // Delay to differentiate between single tap and double tap
  }
});
    
