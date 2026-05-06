const canvas = document.querySelector("#wallpaper");
const ctx = canvas.getContext("2d");
const glowInput = document.querySelector("#glow");
const motionInput = document.querySelector("#motion");
const densityInput = document.querySelector("#density");
const saveButton = document.querySelector("#save");

const settings = {
  glow: Number(glowInput.value),
  motion: Number(motionInput.value),
  density: Number(densityInput.value),
};

let width = 0;
let height = 0;
let particles = [];
let time = 0;

function heartPoint(t, scale) {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return {
    x: x * scale,
    y: -y * scale,
  };
}

function makeParticle(index) {
  const t = (index / settings.density) * Math.PI * 2;
  const layer = 0.78 + Math.random() * 0.34;
  const scale = Math.min(width, height) * 0.018 * layer;
  const point = heartPoint(t, scale);

  return {
    baseX: point.x,
    baseY: point.y,
    size: 1.4 + Math.random() * 3.6,
    drift: Math.random() * Math.PI * 2,
    speed: 0.35 + Math.random() * 1.2,
    hue: Math.random() > 0.7 ? 190 : 342 + Math.random() * 22,
    alpha: 0.44 + Math.random() * 0.48,
  };
}

function rebuildParticles() {
  particles = Array.from({ length: settings.density }, (_, index) => makeParticle(index));
}

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  rebuildParticles();
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#08090f");
  gradient.addColorStop(0.46, "#171120");
  gradient.addColorStop(1, "#051318");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawHeart() {
  const cx = width / 2;
  const cy = height / 2 + Math.min(height * 0.04, 34);
  const pulse = 1 + Math.sin(time * 1.8) * 0.035 * settings.motion;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowBlur = 26 * settings.glow;

  for (const particle of particles) {
    const wave = Math.sin(time * particle.speed * settings.motion + particle.drift);
    const orbit = Math.cos(time * 0.7 * settings.motion + particle.drift);
    const x = cx + particle.baseX * pulse + wave * 9;
    const y = cy + particle.baseY * pulse + orbit * 7;
    const radius = particle.size * (0.82 + wave * 0.18);

    ctx.beginPath();
    ctx.fillStyle = `hsla(${particle.hue}, 96%, 68%, ${particle.alpha})`;
    ctx.shadowColor = `hsla(${particle.hue}, 96%, 68%, ${0.62 * settings.glow})`;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawRibbon() {
  const cx = width / 2;
  const cy = height / 2 + Math.min(height * 0.04, 34);
  const scale = Math.min(width, height) * 0.018;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineWidth = Math.max(1.2, Math.min(width, height) * 0.002);
  ctx.strokeStyle = `rgba(255, 228, 238, ${0.28 * settings.glow})`;
  ctx.shadowBlur = 18 * settings.glow;
  ctx.shadowColor = "rgba(255, 95, 141, 0.8)";
  ctx.beginPath();

  for (let i = 0; i <= 240; i += 1) {
    const t = (i / 240) * Math.PI * 2;
    const point = heartPoint(t, scale);
    const shimmer = Math.sin(t * 8 + time * 2 * settings.motion) * 3.2;
    const x = point.x + shimmer;
    const y = point.y + Math.cos(t * 5 + time) * 2.4;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function frame() {
  time += 0.016;
  drawBackground();
  drawRibbon();
  drawHeart();
  requestAnimationFrame(frame);
}

glowInput.addEventListener("input", () => {
  settings.glow = Number(glowInput.value);
});

motionInput.addEventListener("input", () => {
  settings.motion = Number(motionInput.value);
});

densityInput.addEventListener("input", () => {
  settings.density = Number(densityInput.value);
  rebuildParticles();
});

saveButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "heart-wallpaper.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

window.addEventListener("resize", resize);

resize();
frame();
