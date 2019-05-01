const MB = 1024 * 1024;
export const MAX_SIZE = 500 * MB;

export const limitFileSize = (e, callback) => {
  // 500MB limit
  if (e.target.files[0].size >= MAX_SIZE) {
    alert('Your file size is too big. The maximum file size is 500MB.');
    e.target.value = null;
  } else {
    callback();
  }
};
