const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { DocketRecord } = require('../entities/DocketRecord');
const { PAYMENT_STATUS } = require('../entities/EntityConstants');
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

  const editableFields = {
    caseType: petitionDetails.caseType,
    irsNoticeDate: petitionDetails.irsNoticeDate,
    petitionPaymentDate: petitionDetails.petitionPaymentDate,
    petitionPaymentMethod: petitionDetails.petitionPaymentMethod,
    petitionPaymentStatus: petitionDetails.petitionPaymentStatus,
    petitionPaymentWaivedDate: petitionDetails.petitionPaymentWaivedDate,
    preferredTrialCity: petitionDetails.preferredTrialCity,
    procedureType: petitionDetails.procedureType,
  };

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  const isPaid = editableFields.petitionPaymentStatus === PAYMENT_STATUS.PAID;
  const isWaived =
    editableFields.petitionPaymentStatus === PAYMENT_STATUS.WAIVED;

  const newCase = new Case(
    {
      ...oldCase,
      ...editableFields,
      petitionPaymentDate: isPaid ? editableFields.petitionPaymentDate : null,
      petitionPaymentMethod: isPaid
        ? editableFields.petitionPaymentMethod
        : null,
      petitionPaymentWaivedDate: isWaived
        ? editableFields.petitionPaymentWaivedDate
        : null,
    },
    { applicationContext },
  );

  if (oldCase.petitionPaymentStatus === PAYMENT_STATUS.UNPAID) {
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
