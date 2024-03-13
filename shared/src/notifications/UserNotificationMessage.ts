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

export interface SaveDocketEntryForLaterComplete {
  action: 'save_docket_entry_for_later_complete';
  alertSuccess: {
    message: string;
    overwritable: boolean;
  };
  docketEntryId: string;
}

export type UserNotificationMessage =
  | ServeDocumentError
  | ServeDocumentComplete
  | RetryAsyncRequest
  | SaveDocketEntryForLaterComplete
  | ServeToIrsComplete
  | ServeToIrsError;
