/**
 * clones a file
 *
 * @param {file} file the file to clone
 * @returns {file} the cloned file
 */
export const cloneFile = (file: File): Promise<File> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.addEventListener('load', () => {
      resolve(
        new File([reader.result as ArrayBuffer], file.name, {
          type: file.type,
        }),
      );
    });

    reader.addEventListener('error', () => {
      reject(new Error('Failed to read file'));
    });
  });
