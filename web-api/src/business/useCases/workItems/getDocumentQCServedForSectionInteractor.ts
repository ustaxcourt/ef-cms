import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  calculateDate,
  createISODateAtStartOfDayEST,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { getDocumentQCServedForSection } from '@web-api/persistence/postgres/workitems/getDocumentQCServedForSection';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '@shared/business/entities/EntityConstants';

export const getDocumentQCServedForSectionInteractor = async (
  applicationContext: ServerApplicationContext,
  { section }: { section: typeof DOCKET_SECTION | typeof PETITIONS_SECTION },
  authorizedUser: UnknownAuthUser,
): Promise<WorkItemWithCaseInfo[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  const afterDate = await calculateAfterDate(applicationContext);
  const workItems = await getDocumentQCServedForSection({
    afterDate,
    section,
  });

  const filteredWorkItems = workItems.filter(workItem =>
    authorizedUser.role === ROLES.petitionsClerk ? !!workItem.section : true,
  );

  return filteredWorkItems;
};

export const calculateAfterDate = async applicationContext => {
  const daysToRetrieveKey =
    applicationContext.getConstants().CONFIGURATION_ITEM_KEYS
      .SECTION_OUTBOX_NUMBER_OF_DAYS.key;
  let daysToRetrieve = await applicationContext
    .getPersistenceGateway()
    .getConfigurationItemValue({
      applicationContext,
      configurationItemKey: daysToRetrieveKey,
    });
  if (!daysToRetrieve || !Number.isInteger(daysToRetrieve)) {
    daysToRetrieve = 7;
  }
  daysToRetrieve = Math.abs(daysToRetrieve);

  const startOfDay = createISODateAtStartOfDayEST();
  const afterDate = calculateDate({
    dateString: startOfDay,
    howMuch: daysToRetrieve * -1,
    units: 'days',
  });
  return afterDate;
};
