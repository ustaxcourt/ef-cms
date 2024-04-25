import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export const pendingItemCaseSource = [
  'associatedJudge',
  'associatedJudgeId',
  'caseCaption',
  'docketNumber',
  'docketNumberSuffix',
  'status',
  'leadDocketNumber',
  'trialDate',
  'trialLocation',
  'docketNumberWithSuffix',
] as const;

export const pendingItemDocketEntrySource = [
  'docketEntryId',
  'documentType',
  'documentTitle',
  'receivedAt',
] as const;

export type PendingItem = Pick<
  RawCase,
  (typeof pendingItemCaseSource)[number]
> &
  Pick<RawDocketEntry, (typeof pendingItemDocketEntrySource)[number]>;

export const fetchPendingItemsInteractor = async (
  applicationContext: IApplicationContext,
  { judge, page }: { judge: string; page: number },
): Promise<{
  foundDocuments: PendingItem[];
  total: number;
}> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (!judge) {
    throw new Error('judge is required');
  }

  //depends on fetchPendingItems returning a list already sorted by receivedAt
  return await applicationContext.getPersistenceGateway().fetchPendingItems({
    applicationContext,
    judge,
    page,
  });
};
