const MB = 1024 * 1024;
export const MAX_SIZE = 500 * MB;

/**
 * Limits the file size of the file chosen
 *
 * @param {Object} e the file selected event
 * @param {Function} callback call if the file is an acceptable size
 */
export const limitFileSize = (e, callback) => {
  if (e.target.files[0].size >= MAX_SIZE) {
    alert('Your file size is too big. The maximum file size is 500MB.');
    e.target.value = null;
  } else {
    callback();
  }
};
