import wordcloud from 'src/lib/wordcloud2';

class EWordcloud {
  $el: HTMLElement;

  $wrapper: any;

  $canvas: any;

  // 词云配置
  $option: any;

  $wordcloud: any;

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
    this.sortWorldCloud();
    this.fixWeightFactor(this.$option);
    this.setTooltip();

    this.$wordcloud = wordcloud(this.$canvas, this.$option);
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

  private sortWorldCloud() {
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
      console.log(item, dimension, event);
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
          this.$tooltip = window.document.createElement('div');
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

}

export default EWordcloud;
