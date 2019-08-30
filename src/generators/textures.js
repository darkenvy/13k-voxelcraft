module.exports = /*@__PURE__*/ () => {
  const texmap = new Array(12288); // 16 * 16 * 3 * 16

  // 0 = air - Do not consume this slot
  // 1 = grass-topped dirt
  // 2 = dirt - Do not consume this slot.
  // 3 = glass
  // 4 = stone
  // 5 = brick-block
  // 6 = wood planks
  // 7 = log
  // 8 = leaves
  // 9 = water
  // 10 = lava
  // 11 = obsidian
  // 12 = sand
  // 13 = clay
  // 14 = ruby ore
  // 15 = gold ore
  // 16 = diamond ore
  // 17 = ruby block
  // 18 = gold block
  // 19 = diamond block
  // 20 = moss stone

  for (let textureIndex = 1; textureIndex < 21; textureIndex++) {
    /* VarientA and VarientB are really just transparency values. But are great
    for setting variations of colors. */
    let varientA = 255 - ((Math.random() * 96) | 0);
    
    for (let y = 0; y < 16 * 3; y++) {
      for (let x = 0; x < 16; x++) {
        let color = 0x966c4a; // #966c4a
        let varientB = varientA;
        if (y >= 32) varientB /= 2; // side of block
        if ((textureIndex != 4 && textureIndex != 6) || ((Math.random() * 3) | 0) === 0)
          varientA = 255 - ((Math.random() * 96) | 0);

        // 0 = air - Do not consume this slot

        // 1 = grass-topped dirt
        if (textureIndex == 1) {
          if (y < (((x * x * 3 + x * 81) >> 2) & 3) + 18)
            color = 0x6aaa40; // #6aaa40 Top of grass block
          else if (textureIndex == 1 && y < (((x * x * 3 + x * 81) >> 2) & 3) + 19)
            varientA = varientA * 2 / 3; // Edge of grassblock. Set transparency of pixel to 'blend' into dirt
        }

        // 2 = dirt - Do not consume this slot.

        // 3 - glass
        if (textureIndex == 3) {
          color = 0xdedede; // #ddd
          if ( // vert lines
            (x > 0 && x < 15)
            && ( // horiz lines
              (y > 0 && y < 15) || (y > 16 && y < 31) || (y > 32 && y < 47)
            )
          ) varientB = 0;
        }

        // 4 = stone
        if (textureIndex == 4) color = 0x7f7f7f; // #7f7f7f

        // 5 = brick-block
        if (textureIndex == 5) {
          color = 0xb53a15; // #b53a15
          if ((x + (y >> 2) * 4) % 8 === 0 || y % 4 === 0) color = 0xbcafa5; // #bcafa5
        }

        // 6 = wooden plank
        if (textureIndex == 6) {
          color = 0xa0824b; // #a0824b
          if (((Math.random() * 16) | 0) === 0)
            varientA = 255 - ((Math.random() * 96) | 0);
          if (y % 4 === 0)
            varientB = 132;
        }
        
        // 7 = log
        if (textureIndex == 7) {
          color = 0x675231; // #675231
          if (x > 0 && x < 15 && ((y > 0 && y < 15) || (y > 32 && y < 47))) {
            // top of the log
            color = 0xbc9862; // #bc9862
            let xd = x - 7;
            let yd = (y & 15) - 7;
            if (xd < 0) xd = 1 - xd;
            if (yd < 0) yd = 1 - yd;
            if (yd > xd) xd = yd;

            varientA = 196 - ((Math.random() * 32) | 0) + xd % 3 * 32;
          } 
          else if (((Math.random() * 2) | 0) === 0) {
            // side of the log
            varientA = varientA * (140 - (x & 1) * 100) / 100;
          }
        }

        // 8 = leaves
        if (textureIndex == 8) {
          color = 0x50d937; // #50d937
          // Set transparent for air-pockets
          if (((Math.random() * 2) | 0) === 0) {
            color = 0;
            varientB = 255;
          }
        }

        // 9 = water
        if (textureIndex == 9) {
          color = 0x4060ff; // #4060ff #4040ff
          varientB = ((Math.random() * 32) | 0) + 192
        }

        // 10 = lava
        if (textureIndex == 10) {
          color = 0xf13e42; // #d11e22
          varientB = ((Math.random() * 32) | 0) + 192
          if (((Math.random() * 2) | 0) === 0) {
            color = 0xf19e42; // #f19e42
          }
        }

        // 11 = obsidian
        if (textureIndex == 11) {
          color = 0x430463; // #430463
          if (((Math.random() * 2) | 0) === 0) {
            color = 0x230443; // #230443
          }
        }

        // 12 = sand
        if (textureIndex == 12) {
          color = 0xe7dfb0; // #e7dfb0
          if (Math.random() * 16 < 1) {
            varientB = 164 + (x * 4);
          }
        }

        // 13 = clay
        if (textureIndex == 13) {
          color = 0xe7efe0; // #e7efe0
          if (Math.random() * 16 < 1) {
            color = 0xf7af9a; // #f7af9a
          }
        }

        const oreLogic = oreColor => {
          if ((x > 2 && x < 13) && ((y > 2 && y < 13) || y > 18 && y < 29)) {
            if (Math.random() * 4 < 1) color = oreColor;
          }
        }

        // 14 = ruby ore
        if (textureIndex == 14) {
          color = 0x7f7f7f; // #7f7f7f
          oreLogic(0xf13e42); // #f13e42
        }

        // 15 = gold ore
        if (textureIndex == 15) {
          color = 0x7f7f7f; // #7f7f7f
          oreLogic(0xf0c328); // #F0C328
        }

        // 16 = diamond ore
        if (textureIndex == 16) {
          color = 0x7f7f7f; // #7f7f7f
          oreLogic(0x44eded); // #44eded
        }

        // 17 = ruby block
        if (textureIndex == 17) {
          color = 0xd11e22; // #d11e22
          if (Math.random() * 16 < 1) varientB = 164 + (x * 4);

          if (
            (x >= 0 && x < 14) // vert lines
            && ((y > 0 && y < 15) || (y > 16 && y < 31) || (y > 32 && y < 47))  // horiz lines
          ) {
            if (y < 32) color = 0xf13e42; // #f13e42
            varientA = 255
          } 
        }

        // 18 = gold block
        if (textureIndex == 18) {
          color = 0xd0a308; // #d0a308
          if (Math.random() * 16 < 1) varientB = 164 + (x * 4);

          if (
            (x >= 0 && x < 14) // vert lines
            && ((y > 0 && y < 15) || (y > 16 && y < 31) || (y > 32 && y < 47))  // horiz lines
          ) {
            if (y < 32) color = 0xf0c328; // #f0c328
            varientA = 255
          } 
        }

        // 19 = diamond block
        if (textureIndex == 19) {
          color = 0x33abab; // #33abab
          if (Math.random() * 16 < 1) varientB = 164 + (x * 4);

          if (
            (x >= 0 && x < 14) // vert lines
            && ((y > 0 && y < 15) || (y > 16 && y < 31) || (y > 32 && y < 47))  // horiz lines
          ) {
            if (y < 32) color = 0x44eded; // #44eded
            varientA = 255
          } 
        }

        // 20 = moss stone
        if (textureIndex == 20) {
          color = 0x7f7f7f; // #7f7f7f

          if (((Math.random() * 4) | 0) >= 1) {
            if (((Math.random() * 2) | 0) === 0) color = 0x508917; // #508917
            else color = 0x508917; // #707927
          }
        }

        // Calculate pixel's binary data (rgb as one integer)
        const rgbPixel = ((((color >> 16) & 0xff) * varientB / 255) << 16) | // R
                         ((((color >> 8 ) & 0xff) * varientB / 255) << 8)  | // G
                         ((color & 0xff ) * varientB / 255);                 // B

        texmap[x + y * 16 + textureIndex * 256 * 3] = rgbPixel;
      }
    }
  }

  return texmap;
}
