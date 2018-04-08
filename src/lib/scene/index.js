import SceneManager from './SceneManager';
import {setMouseDown} from './sphereTexture';
export default container => {
  const canvas = createCanvas(document, container);
  const manager = SceneManager(canvas);

  const canvasHalfWidth = () => Math.round(canvas.scrollWidth/2);
  const canvasHalfHeight = () => Math.round(canvas.scrollHeight/2);

  bindEventListeners();
  render();

  function createCanvas(document, container) {
    const canvas = document.createElement('canvas');
    setCanvasSize(canvas);
    container.appendChild(canvas);
    return canvas;
  }

  function bindEventListeners() {
    window.onresize = resizeCanvas;
    window.onmousemove = mouseMove;
    resizeCanvas();
  }

  function setCanvasSize(canvas) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width  = width;
    canvas.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }

  function resizeCanvas() {

    setCanvasSize(canvas);

    manager.onWindowResize()
  }

  function mouseMove({clientX, clientY, buttons}) {
    setMouseDown(buttons & 1);
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    let x =  ( clientX / window.innerWidth ) * 2 - 1;
    let y = - ( clientY / window.innerHeight ) * 2 + 1;

    manager.onMouseMove(x, y);
  }

  function render(time) {
    requestAnimationFrame(render);
    manager.update();
  }
}