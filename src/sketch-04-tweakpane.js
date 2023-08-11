const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1920 ], 
  animate: true,

};
const params = {
  cols: 20,
  rows: 50,
  scaleMin: 1,
  scaleMax: 30,
  frequency: 0.001,
  amplitude: 0.2,
  frame: 0,
  animate: true,
  lineCap: 'butt',
}
const sketch = () => {
  // frame per sec also passing canvas-sketch
  return ({ context, width, height, frame }) => {
    context.fillStyle = '#303030';
    context.fillRect(0, 0, width, height);

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;
    // Grid template generation and alignment
    const gridW = width * .8;
    const gridH = height * .9;
    const cellW = gridW / cols;
    const cellH = gridH / rows;
    const margX = (width - gridW) * .5;
    const margY = (height - gridH) * .5;

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
      // const n = random.noise2D(x + frame * 10,y, params.frequency)
      const f = params.animate ? frame : params.frame
      const n = random.noise3D(x ,y,  f * 10, params.frequency)
      
      // or add amplitude value here
      const angle = n * Math.PI * params.amplitude;
      // change the scale of lines
      // const scale = (n * 0.5 + 0.5) * 30
      const scale = math.mapRange(n, -1, 1,  params.scaleMin, params.scaleMax);

      if(scale < params.scaleMax) {
        context.strokeStyle = '#F4F9F9'
      }
      if(scale < (params.scaleMax * .8) ) {
        context.strokeStyle = '#D3E0EA'
      } 
      if (scale < (params.scaleMax * .5)) {
        context.strokeStyle = '#1687A7'
      }
      if(scale < (params.scaleMax * .3)) {
        context.strokeStyle = "#276678"
        
      }
      
      
      context.save()
      
      context.translate(x,y)
      context.translate(margX, margY)
      context.translate(cellW * .5, cellH * .5)
      context.rotate(angle)
      context.lineWidth = 4;
      context.lineWidth = scale;
      context.lineCap = params.lineCap
      context.beginPath()
      context.moveTo(w * - 0.5, 0)
      context.lineTo(w * 0.5, 0)
      context.stroke()
      context.restore()

    }

  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane()
  let folder;

  folder = pane.addFolder({title: 'Grid Settings'})
  folder.addInput(params, 'lineCap', {options: {butt: 'butt', round: 'round', square: 'square'}})
  folder.addInput(params, 'cols', {min:2, max: 50, step: 1})
  folder.addInput(params, 'rows', {min:2, max: 50, step: 1})
  folder.addInput(params, 'scaleMin', {min:1, max: 100})
  folder.addInput(params, 'scaleMax', {min:1, max: 100})
  folder = pane.addFolder({title: 'Noise'})
  folder.addInput(params, 'frequency', {min:-0.01, max: 0.01})
  folder.addInput(params, 'amplitude', {min:0, max: 1})
  folder = pane.addFolder({title: 'Animation'})
  folder.addInput(params, 'animate')
  folder.addInput(params, 'frame', {min:0, max: 999})
}
createPane()
canvasSketch(sketch, settings);
