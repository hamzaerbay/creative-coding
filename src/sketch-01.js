const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};
// TODO: animate this one
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "#F6F5F5";
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * 0.011;

    const w = width * 0.1;
    const h = height * 0.1;
    const gap = width * 0.03;
    const ix = width * 0.17;
    const iy = height * 0.17;
    const off = width * 0.02;

    let x, y;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        x = ix + (w + gap) * i;
        y = iy + (w + gap) * j;
        context.beginPath();
        context.rect(x, y, w, h);
        context.strokeStyle = "#456268";
        context.stroke();

        if (Math.random() > 0.5) {
          context.beginPath();
          context.rect(x + off / 2, y + off / 2, w - off, h - off);
          context.strokeStyle = "#79A3B1";
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
