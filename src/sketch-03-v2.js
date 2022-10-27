const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const settings = {
  dimensions: [1080, 1920],
  animate: true,
};
const theme = {
  agentRadius: {
    min:4,max:10},
  agents: {
    large: "#fff",
    medium: "#fff",
    small: "#fff",
  },
  lines: {
    thick: "#B9D7EA",
    medium: "#D6E6F2",
    thin: "#F7FBFC",
  },
};
// how to animate without canvas-sketch
const animate = () => {
  console.log("creative coding");
  requestAnimationFrame(animate);
};
// animate();
const sketch = ({ width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = "#222831";
    context.fillRect(0, 0, width, height);

    // Connect the agents with lines
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const otherAgent = agents[j];
        const distance = agent.pos.getDistance(otherAgent.pos);

        if (distance > 250) continue;

        context.lineWidth = math.mapRange(distance, 0, 250, 10, 1);

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(otherAgent.pos.x, otherAgent.pos.y);
        if (context.lineWidth > 8) {
          context.strokeStyle = theme.lines.thick;
        } else if (context.lineWidth > 3) {
          context.strokeStyle = theme.lines.medium;
        } else {
          context.strokeStyle = theme.lines.thin;
        }

        context.stroke();
      }
    }

    // Run the animation
    agents.forEach((agent) => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(vector) {
    const dx = this.x - vector.x;
    const dy = this.y - vector.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    // Moving direction of the agent
    this.velocity = new Vector(random.range(-1, 1), random.range(-1, 1));
    // Size of agent
    this.radius = random.range(theme.agentRadius.min, theme.agentRadius.max);
  }
  bounce(width, height) {
    // Bounce off the walls (inverse velocity)
    if (this.pos.x <= 0 || this.pos.x >= width) this.velocity.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.velocity.y *= -1;
  }

  update() {
    // Animate the agent
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    if (this.radius > 9) {
      context.strokeStyle = theme.agents.large;
    } else if (this.radius > 6) {
      context.lineWidth = 3;
      context.strokeStyle = theme.agents.medium;
    } else {
      context.strokeStyle = theme.agents.small;
    }
    context.fill();

    context.stroke();

    context.restore();
  }
}
