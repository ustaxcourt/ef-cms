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
      case 'update_trial_session_complete':
        await app.getSequence('updateTrialSessionCompleteSequence')({
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
      case 'user_contact_initial_update_complete':
        await app.getSequence('userContactUpdateInitialUpdateCompleteSequence')(
          { ...message },
        );
        break;
      case 'user_contact_full_update_complete':
        await app.getSequence('userContactUpdateCompleteSequence')({
          ...message,
        });
        break;
      case 'user_contact_update_progress':
        await app.getSequence('userContactUpdateProgressSequence')({
          ...message,
        });
        break;
      case 'user_contact_update_error':
        await app.getSequence('userContactUpdateErrorSequence')({
          ...message,
        });
        break;
      case 'admin_contact_initial_update_complete':
        await app.getSequence(
          'adminContactUpdateInitialUpdateCompleteSequence',
        )({ ...message });
        break;
      case 'admin_contact_full_update_complete':
        await app.getSequence('adminContactUpdateCompleteSequence')({
          ...message,
        });
        break;
      case 'admin_contact_update_progress':
        await app.getSequence('adminContactUpdateProgressSequence')({
          ...message,
        });
        break;
      case 'maintenance_mode_engaged':
        await app.getSequence('openAppMaintenanceModalSequence')({
          ...message,
          maintenanceMode: true,
          path: '/maintenance',
        });
        break;
      case 'maintenance_mode_disengaged':
        await app.getSequence('disengageAppMaintenanceSequence')({
          ...message,
          maintenanceMode: false,
          path: '/',
        });
        break;
      case 'file_and_serve_court_issued_document_complete':
        await app.getSequence('serveCourtIssuedDocumentCompleteSequence')({
          ...message,
        });
        break;
    }

    (onMessageCallbackFn || noop)(message);
  };
};
