import { OutboxItem } from '../../entities/OutboxItem';
import { ROLES } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  calculateISODate,
  createISODateAtStartOfDayEST,
} from '../../../business/utilities/DateHandler';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to get the document qc served box
 * @returns {object} the work items in the section document served inbox
 */
export const getDocumentQCServedForSectionInteractor = async (
  applicationContext: IApplicationContext,
  { section }: { section: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  const afterDate = await calculateAfterDate(applicationContext);
  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCServedForSection({
      afterDate,
      applicationContext,
      section,
    });

  const filteredWorkItems = workItems
    .filter(workItem =>
      user.role === ROLES.petitionsClerk ? !!workItem.section : true,
    )
    .map(workItem => new OutboxItem(workItem, { applicationContext }));

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
