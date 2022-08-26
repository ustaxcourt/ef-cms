const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  generateAndServeDocketEntry,
} = require('../../useCaseHelper/service/createChangeItems');
const {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { Case } = require('../../entities/cases/Case');
const { clone } = require('lodash');

/**
 * Update an address on a case. This performs a search to get all of the cases associated with the user,
 * and then one by one determines whether or not it needs to generate a docket entry. Only open cases and
 * cases closed within the last six months should get a docket entry.
 *
 * @param {object}  providers the providers object
 * @param {object}  providers.applicationContext the application context
 * @param {boolean} providers.bypassDocketEntry whether or not we should create a docket entry for this operation
 * @param {object}  providers.contactInfo the updated contact information
 * @param {string}  providers.requestUserId the userId making the request to which to send websocket messages
 * @param {string}  providers.updatedName the name of the updated individual
 * @param {object}  providers.user the user whose address is getting updated
 * @param {string}  providers.websocketMessagePrefix is it the `user` or an `admin` performing this action?
 * @returns {Promise<Case[]>} the cases that were updated
 */
const generateChangeOfAddressForPractitioner = async ({
  applicationContext,
  bypassDocketEntry = false,
  contactInfo,
  firmName,
  requestUserId,
  updatedEmail,
  updatedName,
  user,
  websocketMessagePrefix = 'user',
}) => {
  const docketNumbers = await applicationContext
    .getPersistenceGateway()
    .getCasesByUserId({
      applicationContext,
      userId: user.userId,
    });

  if (docketNumbers.length === 0) {
    return [];
  }

  let completedCases = 0;
  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: `${websocketMessagePrefix}_contact_update_progress`,
      completedCases,
      totalCases: docketNumbers.length,
    },
    userId: requestUserId || user.userId,
  });

  const updatedCases = [];

  for (let caseInfo of docketNumbers) {
    try {
      const { docketNumber } = caseInfo;
      const newData = contactInfo;

      const userCase = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });
      let caseEntity = new Case(userCase, { applicationContext });

      const practitionerName = updatedName || user.name;
      const practitionerObject = caseEntity.privatePractitioners
        .concat(caseEntity.irsPractitioners)
        .find(practitioner => practitioner.userId === user.userId);

      if (!practitionerObject) {
        throw new Error(
          `Could not find user|${user.userId} barNumber: ${user.barNumber} on ${docketNumber}`,
        );
      }

      const oldData = clone(practitionerObject.contact);

      // This updates the case by reference!
      practitionerObject.contact = contactInfo;
      practitionerObject.firmName = firmName;
      practitionerObject.name = practitionerName;

      if (!oldData.email && updatedEmail) {
        practitionerObject.serviceIndicator =
          SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
        practitionerObject.email = updatedEmail;
      }

      // TODO: is this even needed any more?
      // we new up another case from the existing case convert '' to null
      caseEntity = new Case(caseEntity, { applicationContext });

      if (!bypassDocketEntry && caseEntity.shouldGenerateNoticesForCase()) {
        await prepareToGenerateAndServeDocketEntry({
          applicationContext,
          caseEntity,
          newData,
          oldData,
          practitionerName,
          user,
        });
      }

      const updatedCase = await applicationContext
        .getUseCaseHelpers()
        .updateCaseAndAssociations({
          applicationContext,
          caseToUpdate: caseEntity,
        });
      updatedCases.push(updatedCase);
    } catch (error) {
      applicationContext.logger.error(error);
    }

    completedCases++;
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: `${websocketMessagePrefix}_contact_update_progress`,
        completedCases,
        totalCases: docketNumbers.length,
      },
      userId: requestUserId || user.userId,
    });
  }

  return updatedCases;
};

/**
 * This function prepares data to be passed to generateAndServeDocketEntry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseEntity the instantiated Case class
 * @param {object} providers.newData the new practitioner contact information
 * @param {object} providers.oldData the old practitioner contact information (for comparison)
 * @param {object} providers.practitionerName the name of the practitioner
 * @param {object} providers.user the user object that includes userId, barNumber etc.
 * @returns {Promise<*>} resolves upon completion of docket entry service
 */
const prepareToGenerateAndServeDocketEntry = async ({
  applicationContext,
  caseEntity,
  newData,
  oldData,
  practitionerName,
  user,
}) => {
  const documentType = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData,
      oldData,
    });

  if (!documentType) return;

  const servedParties = aggregatePartiesForService(caseEntity);

  const docketMeta = {};
  if (user.role === ROLES.privatePractitioner) {
    docketMeta.privatePractitioners = [
      {
        name: practitionerName,
      },
    ];
  } else if (user.role === ROLES.irsPractitioner) {
    docketMeta.partyIrsPractitioner = true;
  }

  newData.name = practitionerName;
  const { changeOfAddressDocketEntry } = await generateAndServeDocketEntry({
    applicationContext,
    barNumber: user.barNumber,
    caseEntity,
    docketMeta,
    documentType,
    newData,
    oldData,
    servedParties,
    user,
  });

  caseEntity.updateDocketEntry(changeOfAddressDocketEntry);
};

module.exports = {
  generateChangeOfAddress: generateChangeOfAddressForPractitioner,
};
