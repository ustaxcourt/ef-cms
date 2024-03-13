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
  pdfUrl: string | undefined;
}

export interface RetryAsyncRequest {
  action: 'retry_async_request';
  originalRequest: any;
  requestToRetry: string;
}

export type UserNotificationMessage =
  | ServeDocumentError
  | ServeDocumentComplete
  | RetryAsyncRequest;
