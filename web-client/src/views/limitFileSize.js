export const limitFileSize = (e, callback) => {
  // 500MB limit
  if (e.target.files[0].size >= 500 * 1024 * 1024) {
    alert('Your file size is too big. The maximum file size is 500MB.');
    e.target.value = null;
  } else {
    callback();
  }
};
