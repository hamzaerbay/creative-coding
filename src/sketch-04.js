const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')

const settings = {
  dimensions: [ 1080, 1080 ], 
  animate: true,
};

const sketch = () => {
  // frame per sec also passing canvas-sketch
  return ({ context, width, height, frame }) => {
    context.fillStyle = '#B9D7EA';
    context.fillRect(0, 0, width, height);

    const cols = 20;
    const rows = 20;
    const numCells = cols * rows;
    // Grid template generation and alignment
    const gridW = width * .8;
    const gridH = height * .8;
    const cellW = gridW / cols;
    const cellH = gridH / rows;
    const margX = (width - gridW) * .5;
    const margY = (width - gridH) * .5;

    for(let i=0; i<numCells; i++) {
      // Create columns and rows
      const col = i % cols;
      const row = Math.floor(i/cols)
      // Position of columns and rows
      const x = col * cellW
      const y = row * cellH
      const w = cellW * .8;
      const h = cellH * .8;

      // Noise
      // to reduce chaotic noise, reduce the frequency and amplitude
      // const n = random.noise2D(x,y, 0.001, 0.2)
      // to make animation, add frame value here and adjust speed with frame * x value
      const n = random.noise2D(x + frame * 10,y, 0.001)
      // or add amplitude value here
      const angle = n * Math.PI * 0.2;
      // change the scale of lines
      // const scale = (n * 0.5 + 0.5) * 30
      const scale = math.mapRange(n, -1, 1,  1, 30);

      context.strokeStyle = "#222831"
      context.save()
      
      context.translate(x,y)
      context.translate(margX, margY)
      context.translate(cellW * .5, cellH * .5)
      context.rotate(angle)
      context.lineWidth = 4;

      context.lineWidth = scale;

      context.beginPath()
      context.moveTo(w * - 0.5, 0)
      context.lineTo(w * 0.5, 0)
      context.stroke()
      context.restore()

    }

  };
};

canvasSketch(sketch, settings);
