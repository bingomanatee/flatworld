import bottle from '../bottle';
import domHelpers from 'dom-helpers';

export default (domElement, resolution) => {
  const canvas = createCanvas(document, domElement);
  const manager = new bottle.container.SceneManager(canvas, resolution);
  function eventNotice(msg) {
    if (false) console.log(msg);
  }
  function createCanvas(document, container) {
    const canvas = document.createElement('canvas');
    setCanvasSize(canvas);
    container.appendChild(canvas);
    return canvas;
  }

  function cancelContext(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
  }

  const windowListeners = [];
  function bindEventListeners() {
    windowListeners.push(domHelpers.listen(window, 'resize', resizeCanvas));
    windowListeners.push(domHelpers.listen(window, 'mousemove', mouseMove));
    windowListeners.push(domHelpers.listen(window, 'contextmenu', cancelContext));
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
    eventNotice('event: resizing canvas');
    manager.onWindowResize();
  }

  function mouseMove(event) {
    eventNotice('event: mouseMove');
    const {clientX, clientY, buttons} = event;
    manager.setMouseDown(buttons &1, buttons &2);
    let x =  ( clientX / window.innerWidth ) * 2 - 1;
    let y = - ( clientY / window.innerHeight ) * 2 + 1;
    manager.onMouseMove(x, y);
  }

  let terminate = false;
  function render(time) {
    if (terminate) {
      eventNotice('render: terminated');
      while (windowListeners.length) {
        windowListeners.pop()();
      }
      return;
    };
    eventNotice('event: render');
    requestAnimationFrame(render);
    manager.update(time);
  }
  function terminateWorld() {
    terminate = true;
  }

  bindEventListeners();
  render();

  return {
    manager,
    terminateWorld
  };
}