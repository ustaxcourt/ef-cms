const noop = () => {};

export const socketRouter = (app, onMessageCallbackFn) => {
  return async event => {
    const message = JSON.parse(event.data);
    const { action } = message;

    switch (action) {
      case 'notice_generation_complete':
        await app.getSequence('noticeGenerationCompleteSequence')({
          ...message,
        });
        break;
      case 'batch_download_ready':
        await app.getSequence('batchDownloadReadySequence')({
          ...message,
        });
        break;
      case 'batch_download_docket_generated':
      case 'batch_download_upload_start':
      case 'batch_download_progress':
        await app.getSequence('updateBatchDownloadProgressSequence')({
          action,
          ...message,
        });
        break;
      case 'batch_download_error':
        await app.getSequence('batchDownloadErrorSequence')({
          ...message,
        });
        break;
    }

    (onMessageCallbackFn || noop)(message);
  };
};
