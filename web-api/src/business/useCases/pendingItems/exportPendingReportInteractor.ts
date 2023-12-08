import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { stringify } from 'csv-stringify/sync';

export const exportPendingReportInteractor = async (
  applicationContext: IApplicationContext,
  { judge }: { judge?: string },
): Promise<string> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { foundDocuments: pendingDocuments } = await applicationContext
    .getPersistenceGateway()
    .fetchPendingItems({
      applicationContext,
      judge,
    });

  const formattedPendingItems = pendingDocuments.map(pendingItem =>
    applicationContext
      .getUtilities()
      .formatPendingItem(pendingItem, { applicationContext }),
  );

  return getCsv(formattedPendingItems);
};

const getCsv = data => {
  return stringify(data, {
    bom: true,
    columns: [
      { header: 'Docket No.', key: 'docketNumberWithSuffix' },
      { header: 'Date Filed', key: 'formattedFiledDate' },
      { header: 'Case Title', key: 'caseTitle' },
      { header: 'Filings and Proceedings', key: 'formattedName' },
      { header: 'Case Status', key: 'formattedStatus' },
      { header: 'Judge', key: 'associatedJudgeFormatted' },
    ],
    header: true,
  });
};
