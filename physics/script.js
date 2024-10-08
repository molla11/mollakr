const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Constraint = Matter.Constraint;

const engine = Engine.create();
const render = Render.create({
  element: document.getElementById("canvas-container"),
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    background: "transparent",
    wireframes: false,
  },
});

function createWalls() {
  const ground = Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight,
    window.innerWidth,
    50,
    { isStatic: true, frictionStatic: 5 }
  );
  const ceiling = Bodies.rectangle(
    window.innerWidth / 2,
    0,
    window.innerWidth,
    50,
    { isStatic: true, frictionStatic: 7 }
  );
  const leftWall = Bodies.rectangle(
    0,
    window.innerHeight / 2,
    50,
    window.innerHeight,
    { isStatic: true, frictionStatic: 7 }
  );
  const rightWall = Bodies.rectangle(
    window.innerWidth,
    window.innerHeight / 2,
    50,
    window.innerHeight,
    { isStatic: true, frictionStatic: 7 }
  );
  World.add(engine.world, [ground, ceiling, leftWall, rightWall]);
}

function launchProjectile() {
  validateGravity();
  document.getElementById("launch-speed").blur();
  document.getElementById("launch-angle").blur();
  document.getElementById("mass").blur();
  document.getElementById("gravity").blur();
  const launchSpeed = parseFloat(document.getElementById("launch-speed").value);
  const launchAngle =
    (parseFloat(document.getElementById("launch-angle").value) * Math.PI) / 180;
  const mass = parseFloat(document.getElementById("mass").value);

  if (isNaN(launchSpeed) || isNaN(launchAngle) || isNaN(mass)) {
    alert("값을 입력해 주세요.");
    return;
  }

  const projectile = Bodies.circle(
    45,
    window.innerHeight - 45,
    Math.cbrt(mass * 800),
    {
      mass: mass,
      restitution: 0.95,
      friction: 0.05,
      frictionAir: 0,
      frictionStatic: 5,
      //inertia: 1000,
    }
  );
  World.add(engine.world, projectile);

  const xVelocity = launchSpeed * Math.cos(launchAngle);
  const yVelocity = -launchSpeed * Math.sin(launchAngle);
  Matter.Body.setVelocity(projectile, { x: xVelocity, y: yVelocity });
}

function clearScreen() {
  while (engine.world.bodies.length) {
    Matter.Composite.remove(engine.world, engine.world.bodies[0]);
  }

  createWalls();
}

function autoLaunch(iter) {
  let i = 0;
  const itv = setInterval(() => {
    launchProjectile();
    if (++i >= iter) clearInterval(itv);
  }, 100);
}

createWalls();

Matter.Runner.run(engine);
Render.run(render);

engine.world.gravity.y = 9.8;
document.getElementById("gravity").addEventListener("input", () => {
  engine.world.gravity.y = parseFloat(document.getElementById("gravity").value);
  validateGravity();
});

document.addEventListener("click", () => {
  validateGravity();
});

function validateGravity() {
  if (document.getElementById("gravity").value == "") {
    engine.world.gravity.y = 0;
    document.getElementById("gravity").value = "0";
  }
}

engine.timing.timeScale = 0.5;
engine.timing.timestamp = 0;

window.onload = () => autoLaunch(5);

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case " ":
      launchProjectile();
      break;
    case "r":
    case "R":
      clearScreen();
      break;
    case "s":
    case "S":
      document.getElementById("launch-speed").focus();
      document.getElementById("launch-speed").value = "";
      break;
    case "a":
    case "A":
      document.getElementById("launch-angle").focus();
      document.getElementById("launch-angle").value = "";
      break;
    case "m":
    case "M":
      document.getElementById("mass").focus();
      document.getElementById("mass").value = "";
      break;
    case "g":
    case "G":
      document.getElementById("gravity").focus();
      document.getElementById("gravity").value = "";
      break;
    default:
      break;
  }
});

const btns = document.getElementsByTagName("button");

for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", () => {
    btns[i].blur();
  });
}
