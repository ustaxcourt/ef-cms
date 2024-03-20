import decompress from 'decompress';

export function unzipFile({
  filePath,
  unzipPath,
}: {
  unzipPath: string;
  filePath: string;
}) {
  return decompress(filePath, unzipPath);
  // .then(files => {
  //   console.log('files', files);
  //   return files;
  // })
  // .catch(err => {
  //   console.error('Err extracting files', err);
  //   return err;
  // });
  // const outputDir = '';
}
