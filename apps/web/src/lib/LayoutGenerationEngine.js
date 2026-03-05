export const generateLayout = (config) => {
  const spaces = [];
  const { corridors, gondolasPerSide, islands, endcapRule, spacing = 2 } = config;
  let spaceIdCounter = 1;

  // Visual constants for the 2D map
  // Base spacing is 140, adjust based on spacing parameter (1-3 meters)
  const corridorSpacing = 100 + (spacing * 20); 
  const aisleWidth = 40 + (spacing * 10); 
  const gondolaWidth = 40;
  const gondolaHeight = 60;
  const startX = 150;
  const startY = 200;

  for (let c = 1; c <= corridors; c++) {
    const currentX = startX + (c - 1) * corridorSpacing;

    // Left side (E - Esquerda)
    for (let g = 1; g <= gondolasPerSide; g++) {
      spaces.push({
        id: `temp_${spaceIdCounter++}`,
        name: `C${c}-E-${g}`,
        space_type: 'gondola',
        corridor: c,
        side: 'left',
        status: 'available',
        position_x: currentX - gondolaWidth - (aisleWidth / 2),
        position_y: startY + (g - 1) * gondolaHeight,
        width: gondolaWidth,
        height: gondolaHeight
      });
    }

    // Right side (D - Direita)
    for (let g = 1; g <= gondolasPerSide; g++) {
      spaces.push({
        id: `temp_${spaceIdCounter++}`,
        name: `C${c}-D-${g}`,
        space_type: 'gondola',
        corridor: c,
        side: 'right',
        status: 'available',
        position_x: currentX + (aisleWidth / 2),
        position_y: startY + (g - 1) * gondolaHeight,
        width: gondolaWidth,
        height: gondolaHeight
      });
    }

    // Endcaps (Pontas)
    const addEndcap = endcapRule === 'all' || 
                     (endcapRule === '1_per_2' && c % 2 !== 0) ||
                     (endcapRule === 'ends_only' && (c === 1 || c === corridors));

    if (addEndcap) {
      spaces.push({
        id: `temp_${spaceIdCounter++}`,
        name: `Ponta-C${c}`,
        space_type: 'endcap',
        corridor: c,
        side: 'center',
        status: 'available',
        position_x: currentX - gondolaWidth - (aisleWidth / 2),
        position_y: startY - (gondolaHeight / 2) - 10,
        width: gondolaWidth * 2 + aisleWidth,
        height: gondolaHeight / 2
      });
    }
  }

  // Promotional Islands (Ilhas)
  const islandSpacing = 120;
  const islandStartX = startX;
  const islandStartY = 80; // Placed at the front of the store

  for (let i = 1; i <= islands; i++) {
    spaces.push({
      id: `temp_${spaceIdCounter++}`,
      name: `Ilha-${i}`,
      space_type: 'island',
      corridor: 0,
      side: 'none',
      status: 'available',
      position_x: islandStartX + (i - 1) * islandSpacing,
      position_y: islandStartY,
      width: 80,
      height: 60
    });
  }

  return spaces;
};
