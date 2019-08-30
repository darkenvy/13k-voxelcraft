const { BLOCKS_MAP, CRAFTABLES } = require('../constants');
const HOTBAR_ICON_PADDING = 2;
const hotbarWidth = (18 * 10);
const hotbarHeight = 16;
const hotbarX = () => (window.game.width - hotbarWidth) / 2
const hotbarY = () => window.game.height - hotbarHeight - 8;

// -------------------------------------------------------------------------- //

function _drawTextureIcon(blockId, xStart, yStart) {
  const { pixels, texmap, width, hotbar } = window.game;

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const texturePixel = texmap[x + (y+16) * 16 + blockId * 256 * 3];
      const count = hotbar.items[blockId];

      const CONTRAST = 255 * 192;
      const brightness = 255; // 255, 205, 155
      const light = brightness * 255 / CONTRAST;
      let r = ((texturePixel >> 16) & 0xff) * light;
      let g = ((texturePixel >> 8) & 0xff) * light;
      let b = (texturePixel & 0xff) * light;

      const pixelLocation = (xStart + x + (yStart + y) * width) * 4;
      if (!count) { // turn greyscale if no items collected
        const avg = (r + g + b) / 6;
        r = avg + (r/3);
        g = avg + (g/3);
        b = avg + (b/3);
      }

      pixels.data[pixelLocation + 0] = r;
      pixels.data[pixelLocation + 1] = g;
      pixels.data[pixelLocation + 2] = b;
    }
  }
}

function _drawNumber(num, x, y) {
  const { ctx } = window.game;
  if (num == void 0) return;

  if (num === Infinity) return;
  let safeNumber = num > 999 ? (num/1000|0)+'k' : num;
  ctx.font = "100 8px OCR A Std,Impact,monospace";
  ctx.strokeStyle = 'black';
  ctx.textAlign = 'right';
  ctx.lineWidth = 2;
  ctx.fillStyle = `#fff`;
  ctx.strokeText(safeNumber, x, y);
  ctx.fillText(safeNumber, x, y);
}


const _findMatIdByCraftableId = /*@__PURE__*/ (id) => {
  let found = 0;
  Object.entries(CRAFTABLES).some(([ rawMatId, craftableArr ]) => {
    const [ craftableId ] = craftableArr || [];
    
    if (craftableId !== id) return false;
    found = rawMatId;
    return true;
  });

  return found;
}

// -------------------------------------------------------------------------- //

function drawIcons() { // pre draw
  const { hotbar } = window.game;

  BLOCKS_MAP[hotbar.side].forEach((id, idx) => {  // eslint-disable-line no-extra-semi
    const hotbarIconIdx = hotbarX() + (16 + HOTBAR_ICON_PADDING) * idx
    _drawTextureIcon(id, hotbarIconIdx, hotbarY());
  });
}

function drawHotbarBorder() { // post draw
  const { ctx, hotbar } = window.game;

  const hotbarSelectedX = hotbarX() + (hotbar.selected * 18);
  ctx.lineWidth = 1;
  ctx.strokeStyle = `#fff`;
  ctx.strokeRect(hotbarSelectedX + 1, hotbarY() + 1, 14, hotbarHeight - 2);
  ctx.strokeStyle = `#000`;
  ctx.strokeRect(hotbarSelectedX, hotbarY(), 16, hotbarHeight);
}

function drawIconNumers() { // post draw
  const { hotbar } = window.game;
  const { side } = hotbar;

  for(let i=0;i<10;i++){
    const hotbarIconIdx = hotbarX() + (16 + HOTBAR_ICON_PADDING) * i;
    const blockId = BLOCKS_MAP[side][i]; // get block id from currently selected hotbar item
    const count = hotbar.items[blockId];
    _drawNumber(count, hotbarIconIdx + 16, hotbarY() + 16)
  }
}

function inventoryAdd(blockId) {
  const { hotbar } = window.game;
  const { items } = hotbar;

  items[blockId]++;

  // -- RAW material pickup -- //
  const craftedBlockCounterpart = CRAFTABLES[blockId];
  if (craftedBlockCounterpart) {
    const [ craftableBlock, quantity ] = craftedBlockCounterpart;
    items[craftableBlock] = items[blockId] / quantity | 0;
    return;
  }

  // -- CRAFTED block pickup -- //
  const rawBlockCounterpart = _findMatIdByCraftableId(blockId);
  if (rawBlockCounterpart) {
    const [ , quantity ] = CRAFTABLES[rawBlockCounterpart];
    items[rawBlockCounterpart]+=quantity;
  }
}

function inventoryRemove(blockId) {
  const { hotbar } = window.game;
  const { items } = hotbar;

  items[blockId]--;

  // -- RAW material placed -- //
  const craftedBlockCounterpart = CRAFTABLES[blockId];
  if (craftedBlockCounterpart) {
    const [ craftableBlock, quantity ] = craftedBlockCounterpart;
    items[craftableBlock] = items[blockId] / quantity | 0;
    return;
  }

  // -- CRAFTED block placed -- //
  const rawBlockCounterpart = _findMatIdByCraftableId(blockId);
  if (rawBlockCounterpart) {
    const [ , quantity ] = CRAFTABLES[rawBlockCounterpart];
    items[rawBlockCounterpart]-=quantity;
  }
}

module.exports = {
  drawIcons,
  drawHotbarBorder,
  drawIconNumers,
  inventoryAdd,
  inventoryRemove,
};
