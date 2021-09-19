import { socketRouter } from './socketRouter';

let mockApp;
let mockSequence;
let mockCallback;

describe('socketRouter', () => {
  beforeEach(() => {
    mockSequence = jest.fn();
    mockCallback = jest.fn();

    mockApp = {
      getSequence: () => {
        return mockSequence;
      },
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
    expect(mockSequence.mock.calls.length).toBe(3);
  });

  it('should call batchDownloadErrorSequence if action is batch_download_error', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "batch_download_error" }',
    });
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call userContactUpdateInitialUpdateCompleteSequence if action is user_contact_initial_update_complete', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "user_contact_initial_update_complete" }',
    });
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call userContactUpdateCompleteSequence if action is user_contact_full_update_complete', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "user_contact_full_update_complete" }',
    });
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call userContactUpdateProgressSequence if action is user_contact_update_progress', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "user_contact_update_progress" }',
    });
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call userContactUpdateErrorSequence if action is user_contact_update_error', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "user_contact_update_error" }',
    });
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call noticeGenerationCompleteSequence if action is notice_generation_complete', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "notice_generation_complete" }',
    });
    expect(mockSequence.mock.calls.length).toBe(1);
  });

  it('should call openAppMaintenanceModalSequence if action is maintenance_mode_engaged', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "maintenance_mode_engaged" }',
    });
    expect(mockSequence.mock.calls.length).toBe(1);
    expect(mockSequence.mock.calls[0][0]).toMatchObject({
      maintenanceMode: true,
    });
  });

  it('should call disengageAppMaintenanceSequence if action is maintenance_mode_disengaged', async () => {
    await socketRouter(mockApp)({
      data: '{ "action": "maintenance_mode_disengaged" }',
    });
    expect(mockSequence.mock.calls.length).toBe(1);
    expect(mockSequence.mock.calls[0][0]).toMatchObject({
      maintenanceMode: false,
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
});
