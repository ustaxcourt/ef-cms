const {
  calculateISODate,
  createISODateAtStartOfDayEST,
} = require('../../../business/utilities/DateHandler');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { OutboxItem } = require('../../entities/OutboxItem');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to get the document qc served box
 * @returns {object} the work items in the section document served inbox
 */
const getDocumentQCServedForSectionInteractor = async (
  applicationContext,
  { section },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  const afterDate = await calculateAfterDate(applicationContext);
  console.log('!!!!', afterDate);
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

const calculateAfterDate = async applicationContext => {
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

  const startOfDay = createISODateAtStartOfDayEST();
  const afterDate = calculateISODate({
    dateString: startOfDay,
    howMuch: daysToRetrieve * -1,
    units: 'days',
  });
  return afterDate;
};

exports.getDocumentQCServedForSectionInteractor =
  getDocumentQCServedForSectionInteractor;
exports.calculateAfterDate = calculateAfterDate;
