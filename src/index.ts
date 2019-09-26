import wordcloud from 'src/lib/wordcloud2';

class EWordcloud {
  $el: HTMLElement;

  $wrapper: any;

  $canvas: any;

  // 词云配置
  $option: any;

  $wordcloud: any;

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
    this.fixWeightFactor(this.$option);
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
            let a = (option.maxFontSize - option.minFontSize) / (Math.pow(max, r) - Math.pow(min, r));
            let b = option.maxFontSize - a * Math.pow(max, r);

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

}

export default EWordcloud;
