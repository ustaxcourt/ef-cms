import fs from 'fs';

export const deleteAllFilesInFolder = (directoryPath: string) => {
  if (!fs.existsSync(directoryPath)) return null;
  fs.rmSync(directoryPath, { recursive: true });
  return null;
};

export const ensureFolderExists = (directory: string) => {
  if (fs.existsSync(directory)) return null;
  fs.mkdirSync(directory);
  return null;
};

export const fileExists = (fileName: string): boolean => {
  const downloadsFolder = 'cypress/downloads';
  const fileLocation = `${downloadsFolder}/${fileName}`;
  return fs.existsSync(fileLocation);
};
