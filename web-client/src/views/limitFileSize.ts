/**
 * Limits the file size of the file chosen
 *
 * @param {object} e the file selected event
 * @param {number} megabyteLimit max size
 * @param {Function} callback call if the file is an acceptable size
 * @returns {boolean} true if the given file size is less than or equal to the limit, otherwise false
 */
export const limitFileSize = (e, megabyteLimit, callback) => {
  let file = e;
  if (e.target) {
    file = e.target.files[0];
  }
  if (file.size >= megabyteLimit * 1024 * 1024) {
    alert(
      `Your file size is too big. The maximum file size is ${megabyteLimit}MB.`,
    );
    if (e.target) {
      e.target.value = null;
    }
    return false;
  } else {
    callback();
    return true;
  }
};
