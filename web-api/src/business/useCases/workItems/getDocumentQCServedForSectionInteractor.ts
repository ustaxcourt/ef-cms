import { OutboxItem } from '../../../../../shared/src/business/entities/OutboxItem';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  calculateISODate,
  createISODateAtStartOfDayEST,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { getDocumentQCServedForSection } from '@web-api/persistence/postgres/workitems/getDocumentQCServedForSection';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to get the document qc served box
 * @returns {object} the work items in the section document served inbox
 */
export const getDocumentQCServedForSectionInteractor = async (
  applicationContext: ServerApplicationContext,
  { section }: { section: string },
  authorizedUser: UnknownAuthUser,
) => {
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

  return OutboxItem.validateRawCollection(filteredWorkItems, {
    applicationContext,
  });
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
  const afterDate = calculateISODate({
    dateString: startOfDay,
    howMuch: daysToRetrieve * -1,
    units: 'days',
  });
  return afterDate;
};
