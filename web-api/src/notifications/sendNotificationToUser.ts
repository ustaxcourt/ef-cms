import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';

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
  user?: RawPractitioner;
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

type NotificationMessage =
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
  | BatchDownloadDocketGeneratedNotification;

export const sendNotificationToUser = async ({
  applicationContext,
  clientConnectionId,
  message,
  userId,
}: {
  applicationContext: ServerApplicationContext;
  clientConnectionId?: string;
  message: NotificationMessage;
  userId: string;
}) => {
  let connections = await applicationContext
    .getPersistenceGateway()
    .getWebSocketConnectionsByUserId({
      applicationContext,
      userId,
    });

  if (clientConnectionId) {
    connections = connections.filter(connection => {
      return connection.clientConnectionId === clientConnectionId;
    });
  }

  const messageStringified = JSON.stringify(message);

  await applicationContext
    .getNotificationGateway()
    .retrySendNotificationToConnections({
      applicationContext,
      connections,
      messageStringified,
    });
};
