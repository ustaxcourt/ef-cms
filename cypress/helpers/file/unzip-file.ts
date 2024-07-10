import { unzipSync } from 'fflate';
import fs from 'fs';

export function unzipFile({ fileName }: { fileName: string }): string[] {
  const downloadsFolder = 'cypress/downloads';
  const fileLocation = `${downloadsFolder}/${fileName}`;
  const zipContent = fs.readFileSync(fileLocation);
  const files = unzipSync(zipContent);
  const fileNames = Object.keys(files);

  return fileNames;
}
