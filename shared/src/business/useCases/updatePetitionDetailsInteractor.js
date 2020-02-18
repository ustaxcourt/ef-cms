const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { DocketRecord } = require('../entities/DocketRecord');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updatePetitionDetailsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.petitionDetails the petition details to update on the case
 * @returns {object} the updated case data
 */
exports.updatePetitionDetailsInteractor = async ({
  applicationContext,
  caseId,
  petitionDetails,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_PETITION_DETAILS)) {
    throw new UnauthorizedError('Unauthorized for editing petition details');
  }

  const {
    petitionPaymentDate,
    petitionPaymentMethod,
    petitionPaymentStatus,
    petitionPaymentWaivedDate,
  } = petitionDetails;

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  const isPaid = petitionPaymentStatus === Case.PAYMENT_STATUS.PAID;
  const isWaived = petitionPaymentStatus === Case.PAYMENT_STATUS.WAIVED;

  const newCase = new Case(
    {
      ...oldCase,
      ...petitionDetails,
      petitionPaymentDate: isPaid ? petitionPaymentDate : null,
      petitionPaymentMethod: isPaid ? petitionPaymentMethod : null,
      petitionPaymentWaivedDate: isWaived ? petitionPaymentWaivedDate : null,
    },
    { applicationContext },
  );

  if (oldCase.petitionPaymentStatus === Case.PAYMENT_STATUS.UNPAID) {
    if (isPaid) {
      newCase.addDocketRecord(
        new DocketRecord(
          {
            description: 'Filing Fee Paid',
            eventCode: 'FEE',
            filingDate: newCase.petitionPaymentDate,
          },
          { applicationContext },
        ),
      );
    } else if (isWaived) {
      newCase.addDocketRecord(
        new DocketRecord(
          {
            description: 'Filing Fee Waived',
            eventCode: 'FEEW',
            filingDate: newCase.petitionPaymentWaivedDate,
          },
          { applicationContext },
        ),
      );
    }
  }

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: newCase.validate().toRawObject(),
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
