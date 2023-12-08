const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const settings = {
  dimensions: [ 1080, 1080 ]
};

let text = 'C'
let fontSize = 1200
let fontFamily = 'serif'
let sketchManager;


// Create a small canvas that we going to use for reading the pixel data on it.
const typeCanvas = document.createElement('canvas')
const typeContext = typeCanvas.getContext('2d')

const sketch = ({ context, width, height }) => {

  const cell = 10;  // cell size
  const cols = Math.floor(width/cell); // 1080 canvas size / 20 = 54 columns
  const rows = Math.floor(height/cell) // 1080 canvas size / 20 = 54 rows
  const numCells = cols * rows

  typeCanvas.width = cols;
  typeCanvas.height = rows


  return ({ context, width, height }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);
    fontSize = cols * 1.2
    typeContext.fillStyle = 'white'
    typeContext.font = `${fontSize}px ${fontFamily}`;
    typeContext.textBaseline = 'top'

    // Alignment
    
    const metrics = typeContext.measureText(text)
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

    // Center align the text
    const x = (cols - mw) * 0.5 -mx;
    const y = (rows - mh) * 0.5 -my;

    typeContext.save();
    // Alignment
    typeContext.translate(x,y)
    // typeContext.translate(width * .5, height * .5)
    
    // Draw outline to see boundries 
    typeContext.beginPath()
    typeContext.rect(mx, my, mw, mh)
    typeContext.stroke()
    
    typeContext.fillText(text, 0, 0)
    typeContext.restore();
    // get typecanvas pixel data
    const typeData = typeContext.getImageData(0,0, cols,rows).data
    console.log(typeData)

    
    // context.fillStyle = 'black'
    context.fillStyle = '#FEFBF3'
    context.fillRect(0,0,width, height)
    
    context.textBaseline="middle";
    context.textAlign ="center"

    // Draw tyoe canvas onto our sketch (for reference)
    // context.drawImage(typeCanvas, 0, 0)

    // read pixel values
    for (let i=0; i< numCells; i++) {
      // canvas is bitmap and we can find cols and rows like what we do for grid
      const col = i % cols;
      const row = Math.floor(i/cols)

      const x = col * cell
      const y = row * cell
      const r = typeData[i * 4 + 0]
      const g = typeData[i * 4 + 1]
      const b = typeData[i * 4 + 2]
      const a = typeData[i * 4 + 3]

      const glyph = getGlyph(r)
      
      context.font = `${cell*2}px ${fontFamily}`
      if(Math.random() < 0.1) context.font = `${cell*6}px ${fontFamily}`
      context.fillStyle = `rgba(${r},${b},${g}, ${a})`
      context.fillStyle = '#506D84'
      
      
      context.save()
      context.translate(x,y)
      context.translate(cell*.5,cell*.5)
      // context.fillRect(0,0,cell,cell)

      // // circle
      // context.beginPath()
      // context.arc(0,0,cell * .5 ,0,Math.PI*2)
      // context.fill()

      context.fillText(glyph, 0,0)
      context.restore()
    }

  };
};

const getGlyph=(v)=> {
  if(v<50) return ''
  if(v<100) return '.'
  if(v<150) return '-'
  if(v<200) return '+'
  const glyphs = '_=/'.split('')
  return random.pick(glyphs)
}

// Listen the Keyboard
const onKeyUp = (e) => {
  text = e.key.toUpperCase();
  // trigger the render each keypress
  sketchManager.render()
}
document.addEventListener('keyup', onKeyUp)

const startRender = async function() {
  sketchManager = await canvasSketch(sketch, settings);
}
startRender()

