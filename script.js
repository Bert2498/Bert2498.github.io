// Neural Network Canvas Animation
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = Math.random() * 2 + 1;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.pulsePhase += 0.02;
    }

    draw(isDarkMode) {
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
        const color = isDarkMode ? 
            `rgba(255, 0, 255, ${0.6 + pulse * 0.4})` : 
            `rgba(0, 255, 200, ${0.6 + pulse * 0.4})`;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + pulse * 1, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + pulse * 2 + 2, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Create particles
const particles = [];
const particleCount = 50;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Draw connections between nearby particles
function drawConnections(isDarkMode) {
    const connectionDistance = 150;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                const opacity = (1 - distance / connectionDistance) * 0.5;
                const color = isDarkMode ? 
                    `rgba(255, 0, 255, ${opacity})` : 
                    `rgba(0, 255, 200, ${opacity})`;

                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Clear canvas with fade effect
    ctx.fillStyle = isDarkMode ? 
        'rgba(3, 8, 18, 0.25)' : 
        'rgba(10, 14, 39, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw(isDarkMode);
    });

    // Draw connections
    drawConnections(isDarkMode);

    requestAnimationFrame(animate);
}

animate();

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light-mode';

// Apply saved theme on page load
if (currentTheme === 'dark-mode') {
    body.classList.add('dark-mode');
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Save the user's preference
    const theme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', theme);
});

// Smooth scroll for buttons (optional enhancement)
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create a ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});
