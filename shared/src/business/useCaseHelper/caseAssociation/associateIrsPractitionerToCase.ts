// const {
//   getConsolidatedCasesForLeadCase,
// } = require('../consolidatedCases/getConsolidatedCasesForLeadCase');
const { Case } = require('../../entities/cases/Case');
const { IrsPractitioner } = require('../../entities/IrsPractitioner');
const { UserCase } = require('../../entities/UserCase');
/**
 * associateIrsPractitionerToCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.serviceIndicator the type of service the irsPractitioner should receive
 * @param {object} providers.user the user object for the logged in user
 * @returns {Promise<*>} the updated case entity
 */
exports.associateIrsPractitionerToCase = async ({
  applicationContext,
  consolidatedCasesDocketNumbers = [],
  docketNumber,
  serviceIndicator,
  user,
}) => {
  let docketNumbersToAssociate = [];
  if (consolidatedCasesDocketNumbers.length > 0) {
    console.log('YES greater than 0!!!!!');

    docketNumbersToAssociate = [...consolidatedCasesDocketNumbers];
  } else {
    docketNumbersToAssociate.push(docketNumber);
  }

  console.log('docketNumbersToAssociate', docketNumbersToAssociate);

  const associatedCaseEntities = await Promise.all(
    docketNumbersToAssociate.map(async caseDocketNumber => {
      const isAssociated = await applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser({
          applicationContext,
          docketNumber: caseDocketNumber,
          userId: user.userId,
        });

      if (!isAssociated) {
        const caseToUpdate = await applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber({
            applicationContext,
            docketNumber: caseDocketNumber,
          });

        const userCaseEntity = new UserCase(caseToUpdate);

        await applicationContext.getPersistenceGateway().associateUserWithCase({
          applicationContext,
          docketNumber: caseDocketNumber,
          userCase: userCaseEntity.validate().toRawObject(),
          userId: user.userId,
        });

        const caseEntity = new Case(caseToUpdate, { applicationContext });
        console.log('caseEntity*****', caseEntity);

        caseEntity.attachIrsPractitioner(
          new IrsPractitioner({ ...user, serviceIndicator }),
        );

        await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
          applicationContext,
          caseToUpdate: caseEntity,
        });

        return caseEntity.toRawObject();
      }
    }),
  );

  console.log('associatedCaseEntities*****', associatedCaseEntities);

  return associatedCaseEntities.find(caseEntity => {
    return caseEntity.docketNumber === docketNumber;
  });
};
