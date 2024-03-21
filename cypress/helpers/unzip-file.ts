import decompress from 'decompress';

export function unzipFile({
  destinationPath,
  filePath,
}: {
  destinationPath: string;
  filePath: string;
}): string[] {
  return decompress(filePath, destinationPath)
    .then(files => {
      return files.map(file => file.path);
    })
    .catch(err => {
      console.error('Err extracting files', err);
      return err;
    });
}
