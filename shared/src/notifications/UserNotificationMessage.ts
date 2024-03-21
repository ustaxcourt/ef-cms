export interface ServeDocumentError {
  action: 'serve_document_error';
  error: string;
}

export interface ServeDocumentComplete {
  action: 'serve_document_complete';
  alertSuccess: {
    message: string;
    overwritable: boolean;
  };
  pdfUrl?: string;
  docketEntryId?: string;
  generateCoversheet?: boolean;
}

export interface RetryAsyncRequest {
  action: 'retry_async_request';
  originalRequest: any;
  requestToRetry: string;
}

export interface ServeToIrsComplete {
  action: 'serve_to_irs_complete';
  pdfUrl: string;
}

export interface ServeToIrsError {
  action: 'serve_to_irs_error';
}

export interface AdminContactFullUpdateComplete {
  action: 'admin_contact_full_update_complete';
}

export interface AdminContactInitialUpdateComplete {
  action: 'admin_contact_initial_update_complete';
}

export interface SaveDocketEntryForLaterComplete {
  action: 'save_docket_entry_for_later_complete';
  alertSuccess: {
    message: string;
    overwritable: boolean;
  };
  docketEntryId: string;
}

export interface DownloadCsvFile {
  action: 'download_csv_file';
  csvInfo: {
    fileName: string;
    url: string;
  };
}

export interface BatchDownloadCsvFile {
  action: 'batch_download_csv_data';
  numberOfRecordsDownloaded: number;
  totalFiles: number;
}

export interface UserContactUpdateError {
  action: 'user_contact_update_error';
  error: string;
}

export interface UserContactFullUpdateComplete {
  action: 'user_contact_full_update_complete';
  user: object;
}

export interface UserContactInitialUpdateComplete {
  action: 'user_contact_initial_update_complete';
}

export interface UpdateTrialSessionComplete {
  action: 'update_trial_session_complete';
  fileId?: string;
  hasPaper?: boolean;
  pdfUrl?: string;
  trialSessionId?: string;
}

export interface NoticeGenerationComplete {
  action: 'notice_generation_complete';
  trialNoticePdfsKeys: string[];
  trialSessionId?: string;
  hasPaper?: boolean;
}

export interface NoticeGenerationStart {
  action: 'notice_generation_start';
  totalCases: number;
}

export interface ThirtyDayNoticePaperServiceComplete {
  action: 'thirty_day_notice_paper_service_complete';
  fileId?: string;
  hasPaper?: boolean;
  pdfUrl?: string;
}

export interface PaperServiceUpdated {
  action: 'paper_service_updated';
  pdfsAppended: number;
}

export interface PaperServiceStarted {
  action: 'paper_service_started';
  totalPdfs: number;
}

export interface SetTrialCalendarPaperServiceComplete {
  action: 'set_trial_calendar_paper_service_complete';
  fileId: string;
  hasPaper: boolean;
  pdfUrl: string;
}

export interface NoticeGenerationUpdated {
  action: 'notice_generation_updated';
}

export interface BatchDownloadError {
  action: 'batch_download_error';
  error: any;
}

export interface BatchDownloadReady {
  action: 'batch_download_ready';
  url: string;
}

export interface BatchDownloadUploadStart {
  action: 'batch_download_upload_start';
  numberOfDocketRecordsToGenerate: number;
  numberOfFilesToBatch: number;
}
export interface BatchDownloadProgress {
  action: 'batch_download_progress';
  numberOfDocketRecordsToGenerate: number;
  numberOfFilesToBatch: number;
}

export interface BatchDownloadEntry {
  action: 'batch_download_entry';
  numberOfDocketRecordsToGenerate: number;
  numberOfFilesToBatch: number;
}

export interface BatchDownloadDocketGenerated {
  action: 'batch_download_docket_generated';
  docketNumber: string;
  numberOfDocketRecordsGenerated: number;
  numberOfDocketRecordsToGenerate: number;
  numberOfFilesToBatch: number;
}

export interface ContactUpdateProgress {
  action: 'user_contact_update_progress' | 'admin_contact_update_progress';
  completedCases: number;
  totalCases: number;
}

export type UserNotificationMessage =
  | ServeDocumentError
  | ServeDocumentComplete
  | RetryAsyncRequest
  | SaveDocketEntryForLaterComplete
  | ServeToIrsComplete
  | ServeToIrsError
  | AdminContactFullUpdateComplete
  | AdminContactInitialUpdateComplete
  | DownloadCsvFile
  | BatchDownloadCsvFile
  | UserContactUpdateError
  | UserContactFullUpdateComplete
  | UserContactInitialUpdateComplete
  | UpdateTrialSessionComplete
  | NoticeGenerationComplete
  | NoticeGenerationStart
  | ThirtyDayNoticePaperServiceComplete
  | PaperServiceUpdated
  | PaperServiceStarted
  | SetTrialCalendarPaperServiceComplete
  | NoticeGenerationUpdated
  | BatchDownloadError
  | BatchDownloadReady
  | BatchDownloadUploadStart
  | BatchDownloadProgress
  | BatchDownloadDocketGenerated
  | ContactUpdateProgress;
