import { TColor } from '@src/models/common';

const COLOR_CLASS_PREFIX = 'Color__';

export const getColorClasses = (color: TColor) => {
  return COLOR_CLASS_PREFIX + color;
};
