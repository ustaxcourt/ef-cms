const diff = require('diff-arrays-of-objects');
const { Case } = require('../../entities/cases/Case');

/**
 * Identifies hearings to be removed, and issues persistence calls
 * where needed
 *
 * @param {object} args the arguments for updating the case
 * @param {object} args.applicationContext the application context
 * @param {object} args.caseToUpdate the case with its updated hearings data
 * @param {object} args.oldCase the case as it is currently stored in persistence, prior to these changes
 * @returns {Array<Promise>} the persistence request promises
 */
const updateHearings = ({ applicationContext, caseToUpdate, oldCase }) => {
  const { removed: deletedHearings } = diff(
    oldCase.hearings,
    caseToUpdate.hearings,
    'trialSessionId',
  );

  return deletedHearings.map(({ trialSessionId }) =>
    applicationContext.getPersistenceGateway().removeCaseFromHearing({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
      trialSessionId,
    }),
  );
};

/**
 * updateCaseAndAssociations
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseToUpdate the case object which was updated
 * @returns {Promise<*>} the updated case entity
 */
exports.updateCaseAndAssociations = async ({
  applicationContext,
  caseToUpdate,
}) => {
  const caseEntity = caseToUpdate.validate
    ? caseToUpdate
    : new Case(caseToUpdate, { applicationContext });

  const oldCaseEntity = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
    });

  const validRawCaseEntity = caseEntity.validate().toRawObject();

  const validRawOldCaseEntity = new Case(oldCaseEntity, { applicationContext })
    .validate()
    .toRawObject();

  const requests = [];

  requests.push(
    ...updateHearings({
      applicationContext,
      caseToUpdate,
      oldCase: validRawOldCaseEntity,
    }),
  );

  // TODO: hoist logic from persistence method below to this use case helper.

  await Promise.all(requests);

  return applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: validRawCaseEntity,
    oldCase: validRawOldCaseEntity,
  });
};
