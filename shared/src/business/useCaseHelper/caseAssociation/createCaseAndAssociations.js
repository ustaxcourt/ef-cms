const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { IrsPractitioner } = require('../../entities/IrsPractitioner');
const { PrivatePractitioner } = require('../../entities/PrivatePractitioner');

/**
 * createCaseDocketEntries
 *
 * @param {object} providers the providers object
 * @param {Array<object>} providers.docketEntries a list of docket entries
 * @param {object} providers.docketNumber the docket number
 * @returns {Array<Promise>} promises which resolve upon creation of all docket entries
 */
const createCaseDocketEntries = ({
  applicationContext,
  docketEntries,
  docketNumber,
  petitioners,
}) => {
  const validDocketEntries = DocketEntry.validateRawCollection(docketEntries, {
    applicationContext,
    petitioners,
  });

  return validDocketEntries.map(doc =>
    applicationContext.getPersistenceGateway().updateDocketEntry({
      applicationContext,
      docketEntryId: doc.docketEntryId,
      docketNumber,
      document: doc,
    }),
  );
};

/**
 * connectIrsPractitioners
 *
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number
 * @param {Array<object>} providers.irsPractitioners a list of IRS practitioners
 * @returns {Array<Promise>} promises which resolve upon creation of all IRS practitioners for this docket number
 */
const connectIrsPractitioners = ({
  applicationContext,
  docketNumber,
  irsPractitioners,
}) => {
  const validIrsPractitioners = IrsPractitioner.validateRawCollection(
    irsPractitioners,
    { applicationContext },
  );

  return validIrsPractitioners.map(practitioner =>
    applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase({
      applicationContext,
      docketNumber,
      practitioner,
      userId: practitioner.userId,
    }),
  );
};

/**
 * connectPrivatePractitioners
 *
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number
 * @param {Array<object>} providers.privatePractitioners a list of private practitioners
 * @returns {Array<Promise>} promises which resolve upon creation of all private practitioners for this docket number
 */
const connectPrivatePractitioners = ({
  applicationContext,
  docketNumber,
  privatePractitioners,
}) => {
  const validPrivatePractitioners = PrivatePractitioner.validateRawCollection(
    privatePractitioners,
    { applicationContext },
  );

  return validPrivatePractitioners.map(practitioner =>
    applicationContext.getPersistenceGateway().updatePrivatePractitionerOnCase({
      applicationContext,
      docketNumber,
      practitioner,
      userId: practitioner.userId,
    }),
  );
};

/**
 * createCaseAndAssociations
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseToCreate the case object to be created
 * @returns {Promise} which resolves when case and associations have been created
 */
exports.createCaseAndAssociations = async ({
  applicationContext,
  caseToCreate,
}) => {
  const caseEntity = caseToCreate.validate
    ? caseToCreate
    : new Case(caseToCreate, { applicationContext });

  const validRawCaseEntity = caseEntity.validate().toRawObject();

  const {
    docketEntries,
    docketNumber,
    irsPractitioners,
    privatePractitioners,
  } = validRawCaseEntity;

  const requests = [
    applicationContext.getPersistenceGateway().createCase({
      applicationContext,
      caseToCreate,
    }),
    ...createCaseDocketEntries({
      applicationContext,
      docketEntries,
      docketNumber,
      petitioners: caseToCreate.petitioners,
    }),
    ...connectIrsPractitioners({
      applicationContext,
      docketNumber,
      irsPractitioners,
    }),
    ...connectPrivatePractitioners({
      applicationContext,
      docketNumber,
      privatePractitioners,
    }),
  ];

  return await Promise.all(requests);
};
