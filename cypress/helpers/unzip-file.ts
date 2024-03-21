import decompress from 'decompress';

export function unzipFile({
  destinationPath,
  filePath,
}: {
  destinationPath: string;
  filePath: string;
}): string[] {
  return decompress(filePath, destinationPath)
    .then((files: { path: string }[]) => {
      return files.map(file => file.path);
    })
    .catch((err: any) => {
      console.error('Err extracting files', err);
      return err;
    });
}
