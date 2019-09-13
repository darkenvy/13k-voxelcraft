import intervalSecond from './interval';
import hotbar from '../hotbar';
import drawReticule from './reticule';
// import utils from '../utils';
const movement = require("../movement");
const { render } = require("./render");

let lastAnimatedTime = 0;

function tick() {
  const { ctx, pixels } = window.game;

  /* ========================== Calculation Phase =========================== */

  window._tick += 1;
  movement.applyGravity();
  movement.calculateMovement();
  render();
  
  /* ============================== Draw Phase ============================== */

  // --- predraw --- ///
  hotbar.drawIcons(); // predraw
  // utils.drawAllTextures(); // debug - display all blocks on screen
  
  // --- draw --- ///
  ctx.putImageData(pixels, 0, 0); // place buffer into canvas
  
  // --- postdraw --- ///
  hotbar.drawHotbarBorder(); // postdraw
  hotbar.drawIconNumers();
  drawReticule();
}

/* on supported browsers, use requestAnimationFrame for optimizations */
function checkAnimationFrameTime(time) {
  const { MAX_FPS } = window.game.CONST;
  const requiredTimeDiff = 1000 / MAX_FPS;
  const diff = time - lastAnimatedTime;

  if (diff < requiredTimeDiff) return window.requestAnimationFrame(checkAnimationFrameTime);

  tick();
  lastAnimatedTime = time;
  window.requestAnimationFrame(checkAnimationFrameTime);
}

function init() {
  window._tick = 0; // debug purposes

  const $fps = document.querySelector('.fps');
  intervalSecond(() => {
    const fps = window._tick;
    window.game.fps = fps;
    if ($fps) $fps.innerText = fps.toString() + ' fps';
    window._tick = 0;
  });

  if (!window.requestAnimationFrame) setInterval(tick, 1000 / 100);
  else window.requestAnimationFrame(checkAnimationFrameTime);
}

module.exports = {
  init,
}
