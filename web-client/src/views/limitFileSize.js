export const limitFileSize = (e, callback) => {
  // 500MB limit
  if (e.target.files[0].size >= 500 * 1024 * 1024) {
    alert('Your file must be less than 500 MB.');
    e.target.value = null;
  } else {
    callback();
  }
};
