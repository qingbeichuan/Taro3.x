/**
 * js抛物线动画
 * @param  {[object]} origin [起点元素]
 * @param  {[object]} target [目标点元素]
 * @param  {[object]} element [要运动的元素]
 * @param  {[number]} radian [抛物线弧度]
 * @param  {[number]} time [动画执行时间]
 * @param  {[function]} callback [抛物线执行完成后回调]
 */
export default class Parabola {
  constructor(config) {
    // this.$ = selector => {
    //   return document.querySelector(selector);
    // };
    this.b = 0;
    this.INTERVAL = 15;
    this.timer = null;
    this.config = config || {};
    // 起点
    // this.origin = this.$(this.config.origin) || null;
    // 终点
    // this.target = this.$(this.config.target) || null;
    // 运动的元素
    // this.element = this.$(this.config.element) || null;
    // 曲线弧度
    this.radian = this.config.radian || 0.002;
    // 运动时间(ms)
    this.time = this.config.time || 500;

    this.originX = this.config.origin.x;
    this.originY = this.config.origin.y;
    this.targetX = this.config.target.left;
    this.targetY = this.config.target.top;
    this.diffx = this.targetX - this.originX;
    this.diffy = this.targetY - this.originY;
    this.speedx = this.diffx / this.time;

    // 已知a, 根据抛物线函数 y = a*x*x + b*x + c 将抛物线起点平移到坐标原点[0, 0]，终点随之平移，那么抛物线经过原点[0, 0] 得出c = 0;
    // 终点平移后得出：y2-y1 = a*(x2 - x1)*(x2 - x1) + b*(x2 - x1)
    // 即 diffy = a*diffx*diffx + b*diffx;
    // 可求出常数b的值
    this.b =
      (this.diffy - this.radian * this.diffx * this.diffx) / this.diffx;

    // this.element.style.left = `${this.originX}px`;
    // this.element.style.top = `${this.originY}px`;
  }

  // 确定动画方式
  moveStyle() {
    let moveStyle = '',
      testDiv = document.createElement('input');
    if ('placeholder' in testDiv) {
      ['', 'ms', 'moz', 'webkit'].forEach(function (pre) {
        var transform = pre + (pre ? 'T' : 't') + 'ransform';
        if (transform in testDiv.style) {
          moveStyle = transform;
        }
      });
    }
    return moveStyle;
  }

  move() {
    let start = new Date().getTime(),
      moveStyle = this.moveStyle(),
      _this = this;
    console.log(moveStyle);
    if (this.timer) return;
    // this.element.style.left = `${this.originX}px`;
    // this.element.style.top = `${this.originY}px`;
    // this.element.style[moveStyle] = 'translate(0px,0px)';
    this.timer = setInterval(function () {
      if (new Date().getTime() - start > _this.time) {
        // _this.element.style.left = `${_this.targetX}px`;
        // _this.element.style.top = `${_this.targetY}px`;
        typeof _this.config.callback === 'function' &&
          _this.config.callback({});
        clearInterval(_this.timer);
        _this.timer = null;
        return;
      }
      let x = _this.speedx * (new Date().getTime() - start);
      let y = _this.radian * x * x + _this.b * x;
      _this.config.callback({x,y})
      // if (moveStyle === 'position') {
      //   _this.element.style.left = `${x + _this.originX}px`;
      //   _this.element.style.top = `${y + _this.originY}px`;
      // } else {
      //   if (window.requestAnimationFrame) {
      //     window.requestAnimationFrame(() => {
      //       _this.element.style[moveStyle] =
      //         'translate(' + x + 'px,' + y + 'px)';
      //     });
      //   } else {
      //     _this.element.style[moveStyle] =
      //       'translate(' + x + 'px,' + y + 'px)';
      //   }
      // }
    }, this.INTERVAL);
    return this;
  }
}

// const dom = document.querySelectorAll('.shopping-cart')
// for (let i = 0; i < dom.length; i++) {
//   const element = dom[i];
//   element.addEventListener('click', throttle((e) => {
//     let parabola = new Parabola({
//       origin: '.title' + (i + 1),
//       target: '.goods-title',
//       element: '.move'
//     });
//     parabola.move();
//   }, 550), false);
// }

function throttle(fn, interval = 300) {
  let timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this.arguments)
        timer = null
      }, interval)
    }
  };
}
