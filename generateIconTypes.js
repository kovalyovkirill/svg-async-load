const fs = require('fs/promises');

const { getIconFileNames } = require('./getIconFileNames');

const iconsRoot = './src/atoms/Icon';
const iconTypeName = 'TIconName';

/** Генератор типов для svg иконок, создает тип на основании названия иконки, также добавляет константу для отображения в styleguidist.
 * Файл запускается в автоматическом режиме во время сборки, или же командой: yarn complie.
 * Если же необходимо добваить и использовать в библиотеке новую иконку то нужно добавить сначала svg файл в папку:
 * ./src/atoms/Icon/icons. Затем запусть команду yarn compile. */
const generate = async () => {
  const iconFiles = getIconFileNames();
  const iconNames = iconFiles.sort((a, b) => a.localeCompare(b)).map((file) => `'${file.replace('.svg', '')}'`);
  const typeString = iconNames.join('|\n');
  const generatedFile = `${iconsRoot}/models.ts`;

  await fs.writeFile(
    generatedFile,
    `/** THIS IS GENERATED FILE. DO NOT EDIT! */
export type ${iconTypeName} = ${typeString};
export const ICON_TYPE_NAMES = [${iconNames}];
  `,
  );

  /** Печатает зеленым цветом */
  console.log('\x1b[32m%s\x1b[0m', 'ICON TYPES SUCCESSFULLY GENERATED!');
  console.log('\x1b[32m%s\x1b[0m', `[GENERATED FILE] ${generatedFile}`);
};

generate();
