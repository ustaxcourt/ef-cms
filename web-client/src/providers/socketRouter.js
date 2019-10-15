const noop = () => {};

export const socketRouter = (app, onMessageCallbackFn) => {
  return event => {
    const message = JSON.parse(event.data);
    const { action } = message;

    // NOTE: convert from if block to switch once three+ actions are present
    if (action === 'batch_download_ready') {
      app.getSequence('batchDownloadReadySequence')({
        ...message,
      });
    }

    (onMessageCallbackFn || noop)(message);
  };
};
