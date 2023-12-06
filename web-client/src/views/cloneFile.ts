/**
 * clones a file
 *
 * @param {file} file the file to clone
 * @returns {file} the cloned file
 */
export const cloneFile = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.addEventListener('load', () => {
      resolve(
        new File([reader.result], file.name, {
          type: file.type,
        }),
      );
    });
    reader.addEventListener('error', () => {
      reject(new Error('failed to read file'));
    });
  });
