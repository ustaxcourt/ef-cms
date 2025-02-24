import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { fetchPendingItems } from '@web-api/persistence/postgres/cases/reports/fetchPendingItems';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { sortPendingReportItems } from '@shared/business/utilities/pendingItem/sortPendingReportItems';

export const generatePrintablePendingReportInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    judge,
    sortField,
    sortOrder,
  }: {
    docketNumber?: string;
    judge?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  },
  authorizedUser: UnknownAuthUser,
): Promise<string> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { foundDocuments: pendingDocuments } = await fetchPendingItems({
    applicationContext,
    docketNumber,
    judge,
  });

  const formattedPendingItems = pendingDocuments.map(pendingItem =>
    applicationContext.getUtilities().formatPendingItem(pendingItem),
  );

  let reportTitle = 'All Judges';

  if (judge) {
    reportTitle = `Judge ${judge}`;
  } else if (docketNumber) {
    const caseResult = await getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
    reportTitle = `Docket ${caseResult.docketNumberWithSuffix}`;
  }

  const sortedPendingItems =
    !sortField || !sortOrder
      ? formattedPendingItems
      : sortPendingReportItems(formattedPendingItems, sortField, sortOrder);

  const pdf = await applicationContext.getDocumentGenerators().pendingReport({
    applicationContext,
    data: {
      pendingItems: sortedPendingItems,
      subtitle: reportTitle,
    },
  });

  const key = `pending-report-${applicationContext.getUniqueId()}.pdf`;

  await applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    pdfData: pdf,
    pdfName: key,
    useTempBucket: true,
  });

  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      key,
      useTempBucket: true,
    });

  return url;
};
