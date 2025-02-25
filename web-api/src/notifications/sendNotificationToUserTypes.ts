import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { UserRecord } from '@web-api/persistence/dynamo/dynamoTypes';

type MessageCompletionErrorNotification = {
  action: 'message_completion_error';
  alertError: {
    message: string;
    title: string;
  };
};

type ContactUpdateProgressNotification = {
  action: 'user_contact_update_progress' | 'admin_contact_update_progress';
  completedCases?: number;
  totalCases?: number;
};

type ContactUpdateCompleteNotification = {
  action:
    | 'user_contact_full_update_complete'
    | 'admin_contact_full_update_complete';
  user?: RawPractitioner | UserRecord;
};

type ServeDocumentErrorNotification = {
  action: 'serve_document_error';
  error: string;
};

type ServeDocumentCompleteNotification = {
  action: 'serve_document_complete';
  alertSuccess: {
    message: string;
    overwritable: boolean;
  };
  generateCoversheet?: boolean;
  docketEntryId?: string;
  pdfUrl?: string;
};

type RetryAsyncRequestNotification = {
  action: 'retry_async_request';
  originalRequest: any;
  requestToRetry: string;
};

type BatchDownloadCsvDataNotification = {
  action: 'batch_download_csv_data';
  filesCompleted: number;
  totalFiles: number;
};

type DownloadCsvFileNotification = {
  action: 'download_csv_file';
  csvInfo: {
    fileName: string;
    url: string;
  };
};

type SaveDocketEntryForLaterCompleteNotification = {
  action: 'save_docket_entry_for_later_complete';
  alertSuccess: {
    message: string;
    overwritable: boolean;
  };
  docketEntryId: string;
};

type BatchDownloadErrorNotification = {
  action: 'batch_download_error';
  error: any;
};

type BatchDownloadProgressNotification = {
  action: 'batch_download_progress';
  filesCompleted: number;
  totalFiles: number;
};

type BatchDownloadReadyNotification = {
  action: 'batch_download_ready';
  url: string;
};

type AwsBatchDownloadProgressNotification = {
  action: 'aws_batch_download_progress';
  filesCompleted: number;
  totalFiles: number;
};

type MessageCompletionSucessNotification = {
  action: 'message_completion_success';
  completedMessageIds: string[];
};

type AdminContactInitialUpdateCompleteNotification = {
  action: 'admin_contact_initial_update_complete';
};

type ServeToIrsCompleteNotification = {
  action: 'serve_to_irs_complete';
  pdfUrl: string;
};

type ServeToIrsErrorNotification = {
  action: 'serve_to_irs_error';
};

type BatchDownloadDocketGeneratedNotification = {
  action: 'batch_download_docket_generated';
  filesCompleted: number;
  totalFiles: number;
};

type NoticeGenerationUpdatedNotification = {
  action: 'notice_generation_updated';
};

type PaperServiceStartedNotification = {
  action: 'paper_service_started';
  totalPdfs: number;
};

type PaperServiceUpdatedNotification = {
  action: 'paper_service_updated';
  pdfsAppended: number;
};

type SetTrialCalendarPaperServiceCompleteNotification = {
  action: 'set_trial_calendar_paper_service_complete';
  fileId: string;
  hasPaper: boolean;
  pdfUrl: string;
};

type ThirtyDayNoticePaperServiceCompleteNotification = {
  action: 'thirty_day_notice_paper_service_complete';
  pdfUrl?: string;
  fileId?: string;
  hasPaper?: boolean;
};

type NoticeGenerationCompleteNotification = {
  action: 'notice_generation_complete';
  hasPaper?: boolean;
  trialNoticePdfsKeys: string[];
  trialSessionId?: string;
};

type NoticeGenerationStartNotification = {
  action: 'notice_generation_start';
  totalCases: number;
};

type SetTrialSessionCalendarCompleteNotification = {
  action: 'set_trial_session_calendar_complete';
  trialSessionId: string;
};

type SetTrialSessionCalendarErrorNotification = {
  action: 'set_trial_session_calendar_error';
  message: string;
};

type UpdateTrialSessionCompleteNotification = {
  action: 'update_trial_session_complete';
  fileId?: string;
  hasPaper?: boolean;
  pdfUrl?: string;
  trialSessionId?: string;
};

type UserContactInitialUpdateCompleteNotification = {
  action: 'user_contact_initial_update_complete';
};

type UserContactUpdateErrorNotification = {
  action: 'user_contact_update_error';
  error: string;
};

export type NotificationMessage =
  | MessageCompletionErrorNotification
  | ContactUpdateProgressNotification
  | ContactUpdateCompleteNotification
  | ServeDocumentErrorNotification
  | ServeDocumentCompleteNotification
  | RetryAsyncRequestNotification
  | BatchDownloadCsvDataNotification
  | DownloadCsvFileNotification
  | SaveDocketEntryForLaterCompleteNotification
  | BatchDownloadErrorNotification
  | BatchDownloadProgressNotification
  | BatchDownloadReadyNotification
  | AwsBatchDownloadProgressNotification
  | MessageCompletionSucessNotification
  | AdminContactInitialUpdateCompleteNotification
  | ServeToIrsCompleteNotification
  | ServeToIrsErrorNotification
  | BatchDownloadDocketGeneratedNotification
  | NoticeGenerationUpdatedNotification
  | PaperServiceStartedNotification
  | PaperServiceUpdatedNotification
  | SetTrialCalendarPaperServiceCompleteNotification
  | ThirtyDayNoticePaperServiceCompleteNotification
  | NoticeGenerationCompleteNotification
  | NoticeGenerationStartNotification
  | SetTrialSessionCalendarCompleteNotification
  | SetTrialSessionCalendarErrorNotification
  | UpdateTrialSessionCompleteNotification
  | UserContactInitialUpdateCompleteNotification
  | UserContactUpdateErrorNotification;

type MaintenanceModeEngaged = {
  action: 'maintenance_mode_engaged';
};

type MaintenanceModeDisengaged = {
  action: 'maintenance_mode_disengaged';
};

export type SocketRouterNotificationMessage =
  | NotificationMessage
  | MaintenanceModeEngaged
  | MaintenanceModeDisengaged;
