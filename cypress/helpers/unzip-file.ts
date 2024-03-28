import decompress from 'decompress';

export async function unzipFile({
  destinationPath,
  filePath,
}: {
  destinationPath: string;
  filePath: string;
}): Promise<string[] | void> {
  try {
    const files = await decompress(filePath, destinationPath);
    return files.map(file => file.path);
  } catch (error) {
    console.error('Error in decompressing the zip:', filePath, error);
    return;
  }
}
