/**
 * Limits the file size of the file chosen
 *
 * @param {object} e the file selected event
 * @param {number} megabyteLimit max size
 * @param {Function} callback call if the file is an acceptable size
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
    e.target.value = null;
  } else {
    callback();
  }
};
