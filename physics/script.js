// K

const Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Bodies = Matter.Bodies,
	Constraint = Matter.Constraint,
	id_K = 12,
	makeRect_K = (bs64) => {
		const alter_K = document.createElement('div');
		alter_K.innerText = decodeURIComponent(escape(window.atob(bs64)));
		alter_K.id += String.fromCharCode(id_K * 9 + 1);
		alter_K.id += String.fromCharCode(id_K * 10 + 1);
		const body = document.getElementsByTagName('body')[0];
		body.appendChild(alter_K);
	};

const engine = Engine.create();
const render = Render.create({
	element: document.getElementById('canvas-container'),
	engine: engine,
	options: {
		width: window.innerWidth,
		height: window.innerHeight,
		background: 'transparent',
		wireframes: false
	}
});

function createWalls() {
	const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, { isStatic: true });
	const ceiling = Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, { isStatic: true });
	const leftWall = Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });
	const rightWall = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });
	World.add(engine.world, [ground, ceiling, leftWall, rightWall]);
}

function launchProjectile() {
	const launchSpeed = parseFloat(document.getElementById('launch-speed').value);
	const launchAngle = parseFloat(document.getElementById('launch-angle').value) * Math.PI / 180;
	const mass = parseFloat(document.getElementById('mass').value);

	const projectile = Bodies.circle(25, window.innerHeight - 25, Math.cbrt(mass * 800), { 
		mass: mass, 
		restitution: 0.95,
		friction: 0.05,
		frictionAir: 0,
		frictionStatic: 7,
		//inertia: 1000,
	});
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
	const itv = setInterval(()=>{
		launchProjectile();
		if (++i >= iter) clearInterval(itv);
	}, 100);
}

makeRect_K('MzcyMCDsnq' + 'XtmITsiJg=');
createWalls();

Matter.Runner.run(engine);
Render.run(render);

engine.world.gravity.y = 9.8;
document.getElementById('gravity').addEventListener('input', () => {
	engine.world.gravity.y = parseFloat(document.getElementById('gravity').value);
})
engine.timing.timeScale = 0.5;
engine.timing.timestamp = 0;

window.onload = () => autoLaunch(5);

document.addEventListener('keydown', e => {
	if (e.key == ' ') {
		launchProjectile();
	}
});