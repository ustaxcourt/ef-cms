/**
 * cancels all uploads in progress
 */
export const cancelUploadsAction = () => {
  if (window.cancelFileUploads && window.cancelFileUploads.length > 0) {
    window.cancelFileUploads.forEach(cancel => {
      cancel();
    });
    window.cancelFileUploads = [];
  }
};
