import { socketRouter } from './socketRouter';

let mockApp;
let mockSequence;
let mockCallback;
let mockGetSequence;

describe('socketRouter', () => {
  beforeAll(() => {
    mockGetSequence = jest.fn().mockImplementation(() => mockSequence);
  });

  beforeEach(() => {
    mockSequence = jest.fn();
    mockCallback = jest.fn();

    mockApp = {
      getSequence: mockGetSequence,
      getState: () => {
        return 'mockToken';
      },
    };
  });

  it('should call batchDownloadReadySequence and callback if present', async () => {
    await socketRouter(
      mockApp,
      mockCallback,
    )({
      data: '{ "action": "batch_download_ready" }',
    });
    await socketRouter(mockApp)({
      data: '{ "action": "batch_download_ready" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith('batchDownloadReadySequence');
    expect(mockSequence.mock.calls.length).toBe(2);
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('should call updateBatchDownloadProgressSequence if action is batch_download_docket_generated, batch_download_upload_start, or batch_download_progress', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "batch_download_docket_generated" }',
    });
    expect(mockSequence.mock.calls.length).toBe(1);
    await socketRouter(mockApp)({
      data: '{ "action": "batch_download_upload_start" }',
    });
    expect(mockSequence.mock.calls.length).toBe(2);
    await socketRouter(mockApp)({
      data: '{ "action": "batch_download_progress" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'updateBatchDownloadProgressSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(3);
  });

  it('should call batchDownloadErrorSequence if action is batch_download_error', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "batch_download_error" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith('batchDownloadErrorSequence');
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call userContactUpdateInitialUpdateCompleteSequence if action is user_contact_initial_update_complete', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "user_contact_initial_update_complete" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'userContactUpdateInitialUpdateCompleteSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call userContactUpdateCompleteSequence if action is user_contact_full_update_complete', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "user_contact_full_update_complete" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'userContactUpdateCompleteSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call userContactUpdateProgressSequence if action is user_contact_update_progress', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "user_contact_update_progress" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'userContactUpdateProgressSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call userContactUpdateErrorSequence if action is user_contact_update_error', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "user_contact_update_error" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'userContactUpdateErrorSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call noticeGenerationCompleteSequence if action is notice_generation_complete', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "notice_generation_complete" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'noticeGenerationCompleteSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call openAppMaintenanceModalSequence if action is maintenance_mode_engaged', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "maintenance_mode_engaged" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'openAppMaintenanceModalSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
    expect(mockSequence.mock.calls[0][0]).toMatchObject({
      maintenanceMode: true,
    });
  });

  it('should call disengageAppMaintenanceSequence if action is maintenance_mode_disengaged', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "maintenance_mode_disengaged" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'disengageAppMaintenanceSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
    expect(mockSequence.mock.calls[0][0]).toMatchObject({
      maintenanceMode: false,
    });
  });

  it('should call retryAsyncRequestSequence if action is retry_async_request', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "retry_async_request", "request_to_retry": "add_paper_filing" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith('retryAsyncRequestSequence');
    expect(mockSequence.mock.calls.length).toBe(1);
    expect(mockSequence.mock.calls[0][0]).toMatchObject({
      request_to_retry: 'add_paper_filing',
    });
  });

  it('should not call a sequence if action is an unknown action', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "unknown" }',
    });
    expect(mockSequence.mock.calls.length).toBe(0);
  });

  it('should not call a sequence if action is undefined', async () => {
    await socketRouter(mockApp)({
      data: '{ }',
    });
    expect(mockSequence.mock.calls.length).toBe(0);
  });

  it('should call updateTrialSessionCompleteSequence if action is update_trial_session_complete', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "update_trial_session_complete" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'updateTrialSessionCompleteSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call adminContactUpdateInitialUpdateCompleteSequence if action is admin_contact_initial_update_complete', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "admin_contact_initial_update_complete" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'adminContactUpdateInitialUpdateCompleteSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call adminContactUpdateCompleteSequence if action is admin_contact_full_update_complete', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "admin_contact_full_update_complete" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'adminContactUpdateCompleteSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call adminContactUpdateCompleteSequence if action is admin_contact_update_progress', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "admin_contact_update_progress" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'adminContactUpdateProgressSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call saveDocketEntryForLaterCompleteSequence if action is save_docket_entry_for_later_complete', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "save_docket_entry_for_later_complete" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'saveDocketEntryForLaterCompleteSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call serveDocumentCompleteSequence if action is serve_document_complete', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "serve_document_complete" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith(
      'serveDocumentCompleteSequence',
    );
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call serveDocumentErrorSequence if action is serve_document_error', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "serve_document_error" }',
    });
    expect(mockGetSequence).toHaveBeenCalledWith('serveDocumentErrorSequence');
    expect(mockSequence.mock.calls.length).toBe(1);
  });
});
