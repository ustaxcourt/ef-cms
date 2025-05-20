import {
  IRS_SYSTEM_SECTION,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { OutboxItem } from '../../../../../shared/src/business/entities/OutboxItem';
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
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

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
    sections: [section, IRS_SYSTEM_SECTION],
  });

  const filteredWorkItems = workItems.filter(workItem =>
    authorizedUser.role === ROLES.petitionsClerk ? !!workItem.section : true,
  );

  return OutboxItem.validateRawCollection(filteredWorkItems, {
    applicationContext,
  });
};

async function getDaysToRetrieve(
  applicationContext: ServerApplicationContext,
): Promise<number> {
  const { CONFIGURATION_ITEM_KEYS } = applicationContext.getConstants();
  const daysToRetrieveKey =
    CONFIGURATION_ITEM_KEYS.SECTION_OUTBOX_NUMBER_OF_DAYS.key;

  const daysToRetrieveRecord = await getFeatureFlagValues([daysToRetrieveKey]);
  if (!daysToRetrieveRecord || daysToRetrieveRecord.length === 0) return 7;

  const { current } = daysToRetrieveRecord[0].value;
  if (!current || !Number.isInteger(current)) {
    return 7;
  }
  return Math.abs(current);
}

export const calculateAfterDate = async applicationContext => {
  const daysToRetrieve = await getDaysToRetrieve(applicationContext);
  const startOfDay = createISODateAtStartOfDayEST();
  const afterDate = calculateDate({
    dateString: startOfDay,
    howMuch: daysToRetrieve * -1,
    units: 'days',
  });
  return afterDate;
};
