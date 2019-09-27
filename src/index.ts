import wordcloud from 'src/lib/wordcloud2';

class EWordcloud {

  static isSupported=wordcloud.isSupported;

  static minFontSize=wordcloud.minFontSize;

  $el: HTMLElement;

  $wrapper: any;

  $maskCanvas: any;

  $canvas: any;

  // 词云配置
  $option: any;

  $tooltip: any;

  constructor(el: HTMLElement) {
    this.$el = el;
    this.init();
  }

  /**
   * setOption
   */
  setOption(option: any) {
    this.$option=option;
    this.$option.fontFamily = this.$option.fontFamily || 'Microsoft YaHei,Helvetica,Times,serif';
    this.sortWorldCloudList();
    this.fixWeightFactor(this.$option);
    this.setTooltip();
    if (this.$option && /\.(jpg|png)$/.test(this.$option.imageShape)) {
      this.imageShape();
    } else {
      this.renderShape();
    }

  }
  /**
   * resize
   */
  resize() {

  }

  private init() {
    const width = this.$el.clientWidth;
    const height = this.$el.clientHeight;

    this.$el.innerHTML = '';

    this.$wrapper = document.createElement('div');
    this.$wrapper.style.position = 'relative';
    this.$wrapper.style.width = '100%';
    this.$wrapper.style.height = 'inherit';

    this.$el.appendChild(this.$wrapper);

    this.$canvas = window.document.createElement('canvas');
    this.$canvas.width = width;
    this.$canvas.height = height;
    this.$wrapper.appendChild(this.$canvas);
  }

  private sortWorldCloudList() {
    this.$option.list && this.$option.list.sort((a: any[], b: any[]) => b[1] - a[1]);
  }

  /**
   * 确定字体大小
   * 默认[12,60]
  */
  private fixWeightFactor(option: any) {
    option.maxFontSize = typeof option.maxFontSize === 'number' ? option.maxFontSize : 60;
    option.minFontSize = typeof option.minFontSize === 'number' ? option.minFontSize : 12;
    if(option.list && option.list.length > 0) {
        let min = option.list[0][1];
        let max = 0;
        for(let i = 0, len = option.list.length; i < len; i++ ) {
            if(min > option.list[i][1]) {
                min = option.list[i][1];
            }
            if(max < option.list[i][1]) {
                max = option.list[i][1];
            }
        }

        // 用y=ax^r+b公式确定字体大小
        if(max > min) {
            const r = typeof option.fontSizeFactor === 'number' ? option.fontSizeFactor : 1 / 10;
            const a = (option.maxFontSize - option.minFontSize) / (Math.pow(max, r) - Math.pow(min, r));
            const b = option.maxFontSize - a * Math.pow(max, r);

            option.weightFactor = (size: any)=> {
                return Math.ceil(a * Math.pow(size, r) + b);
            };
        } else {
            option.weightFactor = (size: any)=> {
                return option.minFontSize;
            };
        }
    }
  }

  /**
   * tooltips
   * 重新赋值hover
  */
  private setTooltip() {
    const originHoverCb: any = this.$option.hover;
    const hoverCb = (item: any, dimension: any, event: any) => {
      if(item) {
          let html = item[0] + ': ' + item[1];
          if(typeof this.$option.tooltip.formatter === 'function') {
              html = this.$option.tooltip.formatter(item);
          }
          this.$tooltip.innerHTML = html;
          this.$tooltip.style.top = (event.offsetY + 10) + 'px';
          this.$tooltip.style.left = (event.offsetX + 15) + 'px';
          this.$tooltip.style.display = 'block';
          this.$wrapper.style.cursor = 'pointer';
      } else {
          this.$tooltip.style.display = 'none';
          this.$wrapper.style.cursor = 'default';
      }

      originHoverCb && originHoverCb(item, dimension, event);
    };

    if (this.$option.tooltip && this.$option.tooltip.show === true) {
      if(!this.$tooltip) {
          this.$tooltip = document.createElement('div');
          this.$tooltip.className='__wc_tooltip__';
          this.$tooltip.style.backgroundColor = this.$option.tooltip.backgroundColor || 'rgba(0, 0, 0, 0.701961)';
          this.$tooltip.style.color = '#fff';
          this.$tooltip.style.padding = '5px';
          this.$tooltip.style.borderRadius = '5px';
          this.$tooltip.style.fontSize = '12px';
          this.$tooltip.style.fontFamily = this.$option.fontFamily;
          this.$tooltip.style.lineHeight = 1.4;
          this.$tooltip.style.webkitTransition = 'left 0.2s, top 0.2s';
          this.$tooltip.style.mozTransition = 'left 0.2s, top 0.2s';
          this.$tooltip.style.transition = 'left 0.2s, top 0.2s';
          this.$tooltip.style.position = 'absolute';
          this.$tooltip.style.whiteSpace = 'nowrap';
          this.$tooltip.style.zIndex = 999;
          this.$tooltip.style.display = 'none';
          this.$wrapper.appendChild(this.$tooltip);
          this.$el.onmouseout = () => {
              this.$tooltip.style.display = 'none';
          };
      }
      this.$option.hover = hoverCb;
    }
  }

  /**
   * 图片遮罩
  */

  private imageShape() {
    const img = window.document.createElement('img');
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
        this.$maskCanvas = document.createElement('canvas');
        this.$maskCanvas.width = img.width;
        this.$maskCanvas.height = img.height;

        const ctx = this.$maskCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(
            0, 0, this.$maskCanvas.width, this.$maskCanvas.height);
        const newImageData = ctx.createImageData(imageData);

        for (let i = 0; i < imageData.data.length; i += 4) {
            const tone = imageData.data[i] +
                imageData.data[i + 1] +
                imageData.data[i + 2];
            const alpha = imageData.data[i + 3];

            if (alpha < 128 || tone > 128 * 3) {
                // Area not to draw
                newImageData.data[i] =
                    newImageData.data[i + 1] =
                        newImageData.data[i + 2] = 255;
                newImageData.data[i + 3] = 0;
            } else {
                // Area to draw
                newImageData.data[i] =
                    newImageData.data[i + 1] =
                        newImageData.data[i + 2] = 0;
                newImageData.data[i + 3] = 255;
            }
        }
        ctx.putImageData(newImageData, 0, 0);
        this.renderShape();
    };

    img.onerror = ()=> {
        this.renderShape();
    };
    img.src = this.$option.imageShape;
  }

  /**
   * 渲染形状遮罩
  */
  private renderShape() {
    if (this.$maskCanvas) {
      this.$option.clearCanvas = false;

      /* Determine bgPixel by creating
       another canvas and fill the specified background color. */
      const bctx = document.createElement('canvas').getContext('2d')!;

      bctx.fillStyle = this.$option.backgroundColor || '#fff';
      bctx.fillRect(0, 0, 1, 1);
      const bgPixel = bctx.getImageData(0, 0, 1, 1).data;

      const maskCanvasScaled = window.document.createElement('canvas');
      maskCanvasScaled.width = this.$canvas.width;
      maskCanvasScaled.height = this.$canvas.height;
      let ctx = maskCanvasScaled.getContext('2d')!;

      ctx.drawImage(this.$maskCanvas,
          0, 0, this.$maskCanvas.width, this.$maskCanvas.height,
          0, 0, maskCanvasScaled.width, maskCanvasScaled.height);

      const imageData = ctx.getImageData(0, 0, maskCanvasScaled.width, maskCanvasScaled.height);
      const newImageData = ctx.createImageData(imageData);
      for (let i = 0; i < imageData.data.length; i += 4) {
          if (imageData.data[i + 3] > 128) {
              newImageData.data[i] = bgPixel[0];
              newImageData.data[i + 1] = bgPixel[1];
              newImageData.data[i + 2] = bgPixel[2];
              newImageData.data[i + 3] = bgPixel[3];
          } else {
              // This color must not be the same w/ the bgPixel.
              newImageData.data[i] = bgPixel[0];
              newImageData.data[i + 1] = bgPixel[1];
              newImageData.data[i + 2] = bgPixel[2];
              newImageData.data[i + 3] = bgPixel[3] ? (bgPixel[3] - 1) : 1;
          }
      }
      ctx.putImageData(newImageData, 0, 0);

      ctx = this.$canvas.getContext('2d');
      ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
      ctx.drawImage(maskCanvasScaled, 0, 0);
    }
    wordcloud(this.$canvas, this.$option);
  }

}

export default EWordcloud;
