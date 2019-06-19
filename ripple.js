const createSvg = tag =>
  document.createElementNS('http://www.w3.org/2000/svg', tag);

const setSvgAttr = (ele, obj) =>
  Object.keys(obj).forEach(key => {
    ele.setAttribute(key, obj[key]);
  });

const createRipple = (x, y, r, color, duration) => {
  const rippleEle = createSvg('svg');
  const circleEle = createSvg('circle');
  const animateEle = createSvg('animate');
  const fadeoutAnimateEle = createSvg('animate');

  rippleEle.style.position = 'absolute';
  rippleEle.style.left = 0;
  rippleEle.style.top = 0;
  rippleEle.style.width = '100%';
  rippleEle.style.height = '100%';

  setSvgAttr(circleEle, { cx: x, cy: y, r: 0, fill: color });
  setSvgAttr(animateEle, {
    attributeName: 'r',
    dur: `${duration}ms`,
    fill: 'freeze',
    begin: 'indefinite',
    to: r
  });
  setSvgAttr(fadeoutAnimateEle, {
    attributeName: 'opacity',
    dur: `200ms`,
    fill: 'freeze',
    begin: 'indefinite',
    to: 0
  });

  circleEle.appendChild(animateEle);
  circleEle.appendChild(fadeoutAnimateEle);
  rippleEle.appendChild(circleEle);

  return {
    ele: rippleEle,
    startAnimate: () => {
      animateEle.beginElement();
    },
    stopAnimate: () => {
      fadeoutAnimateEle.beginElement();
    }
  };
};

export default {
  bind(el, binding) {
    const duration = 800;
    const color = binding.value || 'rgba(69, 162, 255, .1)';

    const insertRipple = e => {
      const { top, left, width, height } = el.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const r = Math.ceil(Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)));
      const ripple = createRipple(x, y, r, color, duration);
      el.appendChild(ripple.ele);
      ripple.startAnimate();

      setTimeout(() => {
        ripple.stopAnimate();
      }, duration);

      setTimeout(() => {
        ripple.ele.remove();
      }, duration + 200);
    };

    el.__insertRipple = insertRipple;
    el.addEventListener('mousedown', insertRipple);
  },
  inserted: el => {
    const position = window
      .getComputedStyle(el, null)
      .getPropertyValue('position');
    if (position === 'static') {
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.style.zIndex = 0;
    }
  },
  unbind: el => {
    window.removeEventListener('mousedown', el.__insertRipple);
  }
};
