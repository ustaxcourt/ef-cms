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

type SaveDocketEntryForLaterNotification = {
  action: 'save_docket_entry_for_later_complete';
  csvInfo: {
    fileName: string;
    url: string;
  };
};

type NotificationMessage =
  | MessageCompletionErrorNotification
  | ContactUpdateProgressNotification
  | ContactUpdateCompleteNotification
  | ServeDocumentErrorNotification
  | ServeDocumentCompleteNotification
  | RetryAsyncRequestNotification
  | BatchDownloadCsvDataNotification
  | DownloadCsvFileNotification;

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
