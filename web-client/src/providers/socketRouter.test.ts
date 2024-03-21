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

  const mockSocketRouterCalls = [
    {
      message: { action: 'paper_service_started' },
      sequence: 'showPaperServiceProgressSequence',
    },
    {
      message: { action: 'paper_service_updated' },
      sequence: 'updatePaperServiceProgressSequence',
    },
    {
      message: { action: 'set_trial_calendar_paper_service_complete' },
      sequence: 'updateTrialSessionCompleteSequence',
    },
    {
      message: { action: 'notice_generation_start' },
      sequence: 'showGenerateNoticesProgressSequence',
    },
    {
      message: { action: 'notice_generation_complete' },
      sequence: 'noticeGenerationCompleteSequence',
    },
    {
      message: { action: 'serve_to_irs_complete' },
      sequence: 'serveToIrsCompleteSequence',
    },
    {
      args: { showModal: 'ServeCaseToIrsErrorModal' },
      message: { action: 'serve_to_irs_error' },
      sequence: 'serveToIrsErrorSequence',
    },
    {
      message: { action: 'update_trial_session_complete' },
      sequence: 'updateTrialSessionCompleteSequence',
    },
    {
      message: { action: 'batch_download_ready' },
      sequence: 'batchDownloadReadySequence',
    },
    {
      message: { action: 'batch_download_docket_generated' },
      sequence: 'updateBatchDownloadProgressSequence',
    },
    {
      message: { action: 'batch_download_upload_start' },
      sequence: 'updateBatchDownloadProgressSequence',
    },
    {
      message: { action: 'batch_download_progress' },
      sequence: 'updateBatchDownloadProgressSequence',
    },
    {
      message: { action: 'batch_download_error' },
      sequence: 'batchDownloadErrorSequence',
    },
    {
      message: { action: 'user_contact_initial_update_complete' },
      sequence: 'userContactUpdateInitialUpdateCompleteSequence',
    },
    {
      message: { action: 'user_contact_full_update_complete' },
      sequence: 'userContactUpdateCompleteSequence',
    },
    {
      message: { action: 'user_contact_update_progress' },
      sequence: 'userContactUpdateProgressSequence',
    },
    {
      message: { action: 'user_contact_update_error' },
      sequence: 'userContactUpdateErrorSequence',
    },
    {
      message: { action: 'admin_contact_initial_update_complete' },
      sequence: 'adminContactUpdateInitialUpdateCompleteSequence',
    },
    {
      message: { action: 'admin_contact_full_update_complete' },
      sequence: 'adminContactUpdateCompleteSequence',
    },
    {
      message: { action: 'admin_contact_update_progress' },
      sequence: 'adminContactUpdateProgressSequence',
    },
    {
      args: {
        maintenanceMode: true,
        path: '/maintenance',
      },
      message: { action: 'maintenance_mode_engaged' },
      sequence: 'openAppMaintenanceModalSequence',
    },
    {
      args: {
        maintenanceMode: false,
        path: '/',
      },
      message: { action: 'maintenance_mode_disengaged' },
      sequence: 'disengageAppMaintenanceSequence',
    },
    {
      message: { action: 'save_docket_entry_for_later_complete' },
      sequence: 'saveDocketEntryForLaterCompleteSequence',
    },
    {
      message: { action: 'serve_document_complete' },
      sequence: 'serveDocumentCompleteSequence',
    },
    {
      args: { showModal: 'WorkItemAlreadyCompletedModal' },
      message: { action: 'serve_document_error' },
      sequence: 'serveDocumentErrorSequence',
    },
    {
      message: { action: 'retry_async_request' },
      sequence: 'retryAsyncRequestSequence',
    },
    {
      message: { action: 'download_csv_file' },
      sequence: 'downloadCsvFileSequence',
    },
    {
      message: { action: 'async_sync_result' },
      sequence: 'resolveAsyncSyncRequestSequence',
    },
  ];

  it.each(mockSocketRouterCalls)(
    'should call the expected sequence with the expected args and message',
    async ({ args = {}, message, sequence }) => {
      const socketrouterEvent = { data: JSON.stringify(message) };
      await socketRouter(mockApp)(socketrouterEvent);
      expect(mockSequence).toHaveBeenCalledWith({
        ...message,
        ...args,
      });
      expect(mockGetSequence).toHaveBeenCalledWith(sequence);
    },
  );

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
});
