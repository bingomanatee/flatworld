import SceneManager from './SceneManager';

export default container => {
  const canvas = createCanvas(document, container);
  const manager = SceneManager(canvas);

  let canvasHalfWidth;
  let canvasHalfHeight;

  bindEventListeners();
  render();

  function createCanvas(document, container) {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    return canvas;
  }

  function bindEventListeners() {
    window.onresize = resizeCanvas;
    window.onmousemove = mouseMove;
    resizeCanvas();
  }

  function resizeCanvas() {
    canvas.style.width = '100%';
    canvas.style.height= '100%';
    canvas.style.background='blue';

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    canvasHalfWidth = Math.round(canvas.offsetWidth/2);
    canvasHalfHeight = Math.round(canvas.offsetHeight/2);

    manager.onWindowResize()
  }

  function mouseMove({screenX, screenY}) {
    manager.onMouseMove(screenX-canvasHalfWidth, screenY-canvasHalfHeight);
  }

  function render(time) {
    requestAnimationFrame(render);
    manager.update();
  }
}