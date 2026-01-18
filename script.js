/* ==============================
   PROJECT FILTER
============================== */
const buttons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active from all buttons
    buttons.forEach(b => b.classList.remove("active"));
    // Add active to clicked button
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    projects.forEach(project => {
      if (filter === "all" || project.classList.contains(filter)) {
        project.style.display = "block";
      } else {
        project.style.display = "none";
      }
    });
  });
});


/* ==============================
   BACKGROUND ANIMATION (Canvas Particles)
============================== */

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let width, height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];
const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 120;

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
    
    // Subtle pulsing effect
    this.opacity += Math.sin(Date.now() * 0.001) * 0.001;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    
    // Gradient fill for glow effect
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Bright core
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 1.5})`;
    ctx.fill();
  }
}

// Create particles
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

// Connect close particles with lines
function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const opacity = (1 - distance / 150) * 0.5;
        
        // Create gradient line
        const gradient = ctx.createLinearGradient(
          particles[i].x, particles[i].y,
          particles[j].x, particles[j].y
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * particles[i].opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * particles[j].opacity})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// Animate canvas
function animateBackground() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  connectParticles();
  requestAnimationFrame(animateBackground);
}

animateBackground();