const { Case } = require('../../entities/cases/Case');
const { PrivatePractitioner } = require('../../entities/PrivatePractitioner');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');
const { UserCase } = require('../../entities/UserCase');

/**
 * associatePrivatePractitionerToCase
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {Array} params.representing the contact ids the private practitioner is representing
 * @param {object} providers.user the user object for the logged in user
 * @param {object} providers.serviceIndicator the service indicator
 * @returns {Promise<*>} the updated case entity
 */
exports.associatePrivatePractitionerToCase = async ({
  applicationContext,
  consolidatedCasesDocketNumbers = [],
  docketNumber,
  representing,
  serviceIndicator,
  user,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  consolidatedCasesDocketNumbers: string[];
  serviceIndicator: string;
  user: RawUser;
  representing: string[];
}) => {
  let docketNumbersToAssociate: string[] = [];

  if (consolidatedCasesDocketNumbers.length > 0) {
    docketNumbersToAssociate = [...consolidatedCasesDocketNumbers];
  } else {
    docketNumbersToAssociate.push(docketNumber);
  }

  await Promise.all(
    docketNumbersToAssociate.map(async caseDocketNumber => {
      const isAssociated = await applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser({
          applicationContext,
          docketNumber: caseDocketNumber,
          userId: user.userId,
        });

      const caseToUpdate = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber: caseDocketNumber,
        });

      const isPrivatePractitionerOnCase =
        caseToUpdate.privatePractitioners?.some(
          practitioner => practitioner.userId === user.userId,
        );

      if (!isAssociated) {
        const userCaseEntity = new UserCase(caseToUpdate);

        await applicationContext.getPersistenceGateway().associateUserWithCase({
          applicationContext,
          docketNumber: caseDocketNumber,
          userCase: userCaseEntity.validate().toRawObject(),
          userId: user.userId,
        });

        const caseEntity = new Case(caseToUpdate, { applicationContext });

        const { petitioners } = caseEntity;

        petitioners.map(petitioner => {
          if (representing.includes(petitioner.contactId)) {
            petitioner.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_NONE;
          }
        });

        caseEntity.attachPrivatePractitioner(
          new PrivatePractitioner({
            ...user,
            representing,
            serviceIndicator,
          }),
        );

        await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
          applicationContext,
          caseToUpdate: caseEntity,
        });

        return caseEntity.toRawObject();
      } else if (!isPrivatePractitionerOnCase) {
        applicationContext.logger.error(
          `BUG 9323: Private Practitioner with userId: ${user.userId} was already associated with case ${docketNumber} but did not appear in the privatePractitioners array.`,
        );
      }
    }),
  );
};
