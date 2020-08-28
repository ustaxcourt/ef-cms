const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
} = require('../entities/EntityConstants');
const { Case } = require('../entities/cases/Case');
const { Document } = require('../entities/Document');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updatePetitionDetailsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.petitionDetails the petition details to update on the case
 * @returns {object} the updated case data
 */
exports.updatePetitionDetailsInteractor = async ({
  applicationContext,
  docketNumber,
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
    .getCaseByDocketNumber({ applicationContext, docketNumber });

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
      newCase.addDocumentWithoutDocketRecord(
        new Document(
          {
            description: 'Filing Fee Paid',
            documentType: MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
            eventCode: MINUTE_ENTRIES_MAP.filingFeePaid.eventCode,
            filingDate: newCase.petitionPaymentDate,
            userId: user.userId,
          },
          { applicationContext },
        ),
      );
    } else if (isWaived) {
      newCase.addDocumentWithoutDocketRecord(
        new Document(
          {
            description: 'Filing Fee Waived',
            documentType: MINUTE_ENTRIES_MAP.filingFeeWaived.documentType,
            eventCode: MINUTE_ENTRIES_MAP.filingFeeWaived.eventCode,
            filingDate: newCase.petitionPaymentWaivedDate,
            userId: user.userId,
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
