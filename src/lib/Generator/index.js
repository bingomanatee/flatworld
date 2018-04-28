import _ from "lodash";

export default (bottle) => {
  const CANVAS_WIDTH_RATIO = 2;

  bottle.factory('Generator', (container) => class Generator extends container.CanvasTextureManager {
    constructor (element, resolution, randomWord) {
      super(resolution, {
        brushFlow: 3,
        brushRaised: true,
        brushSize: 1
      });
      this.randomWord = randomWord;
      this.initElement(element);
      this.initCanvas(); // again
      this.getNoise();
    }

    getNoise() {
      console.log('getting noise: ', this.randomWord, this.resolution)
      container.axios.get(container.SERVER_API + [ , 'noise', this.resolution, this.randomWord].join('/'))
        .then(({data}) => {
          this.noiseData = data;
          this.useNoise();
        }).catch((err) => {
          console.log('error getting data: ', err);
      });
    }

    loadData() {
      super.loadData()
        .then(() => this.useNoise());
    }

    useNoise() {
      if (!this.noiseUsed && this.noiseData && this.data) {
        for (let key in this.noiseData) {
          this.setAlpha(parseInt(key), this.noiseData[key]);
        }
        console.log('noise applied');
        this.noiseUsed = true;
      }
    }

    initElement (element) {
      if (element) {
        this.element = element;
      }
      this.width = element.offsetWidth;
      this.height = element.offsetHeight;
    }

    initCanvas () {
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
      }
      this.canvas.width = Math.min(this.width, this.height * CANVAS_WIDTH_RATIO);
      this.canvas.height = Math.min(this.height, this.width / CANVAS_WIDTH_RATIO);
      this.canvas.style.width =  this.canvas.width + 'px';
      this.canvas.style.height =  this.canvas.height + 'px';
      this.canvas.width *= container.DPR;
      this.canvas.height *= container.DPR;

      this.ctx = this.canvas.getContext('2d');

      if (!this.element) {
        return;
      }
      while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
      this.element.appendChild(this.canvas);
      this.draw();
    }
  });
}