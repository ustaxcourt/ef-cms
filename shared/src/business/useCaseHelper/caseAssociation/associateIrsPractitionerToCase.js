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
  docketNumber,
  serviceIndicator,
  user,
}) => {
  const isAssociated = await applicationContext
    .getPersistenceGateway()
    .verifyCaseForUser({
      applicationContext,
      docketNumber,
      userId: user.userId,
    });

  if (!isAssociated) {
    const oldCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });
    const oldCaseCopy = applicationContext
      .getUtilities()
      .cloneAndFreeze(oldCase);

    const userCaseEntity = new UserCase(oldCase);

    await applicationContext.getPersistenceGateway().associateUserWithCase({
      applicationContext,
      docketNumber,
      userCase: userCaseEntity.validate().toRawObject(),
      userId: user.userId,
    });

    const newCase = new Case(oldCase, { applicationContext });

    newCase.attachIrsPractitioner(
      new IrsPractitioner({ ...user, serviceIndicator }),
    );

    applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      newCase,
      oldCaseCopy,
    });

    return newCase.toRawObject();
  }
};
