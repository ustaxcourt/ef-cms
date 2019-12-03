const noop = () => {};

export const socketRouter = (app, onMessageCallbackFn) => {
  return event => {
    const message = JSON.parse(event.data);
    const { action } = message;

    switch (action) {
      case 'batch_download_ready':
        app.getSequence('batchDownloadReadySequence')({
          ...message,
        });
        break;
      case 'batch_download_docket_generated':
      case 'batch_download_upload_start':
      case 'batch_download_progress':
        app.getSequence('updateBatchDownloadProgressSequence')({
          action,
          ...message,
        });
        break;
      case 'batch_download_error':
        app.getSequence('batchDownloadErrorSequence')({
          ...message,
        });
        break;
    }

    (onMessageCallbackFn || noop)(message);
  };
};
