const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updatePetitionFeePaymentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @returns {object} the updated case data
 */
exports.updatePetitionFeePaymentInteractor = async ({
  applicationContext,
  caseId,
  petitionPaymentDate,
  petitionPaymentMethod,
  petitionPaymentStatus,
  petitionPaymentWaivedDate,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  const isPaid = petitionPaymentStatus === Case.PAYMENT_STATUS.PAID;
  const isWaived = petitionPaymentStatus === Case.PAYMENT_STATUS.WAIVED;

  const newCase = new Case(
    {
      ...oldCase,
      petitionPaymentDate: isPaid ? petitionPaymentDate : null,
      petitionPaymentMethod: isPaid ? petitionPaymentMethod : null,
      petitionPaymentStatus,
      petitionPaymentWaivedDate: isWaived ? petitionPaymentWaivedDate : null,
    },
    { applicationContext },
  );

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: newCase.validate().toRawObject(),
  });
};
