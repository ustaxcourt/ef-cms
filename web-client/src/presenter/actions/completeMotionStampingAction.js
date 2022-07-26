import { Stamp } from '../../../../shared/src/business/entities/Stamp';
import { state } from 'cerebral';

/**
 * generates an action for completing motion stamping
 *
 * @param {object} providers the providers object
 * @param {string} providers.applicationContext the applicationContext
 * @param {string} providers.get the cerebral get function
 * @returns {Function} the action to complete the motion stamping
 */
export const completeMotionStampingAction = async ({
  applicationContext,
  get,
}) => {
  const motionDocketEntryID = get(state.pdfForSigning.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  const stampFormData = get(state.form);

  let docketEntryId;
  let newDocketEntryId;

  const { nameForSigning, nameForSigningLine2 } = get(state.pdfForSigning);

  const stampEntity = new Stamp(stampFormData);
  const stampData = {
    ...stampEntity,
    nameForSigning,
    nameForSigningLine2,
  };

  newDocketEntryId = applicationContext.getUniqueId();

  await applicationContext
    .getUseCases()
    .addDraftStampOrderDocketEntryInteractor(applicationContext, {
      docketNumber,
      originalDocketEntryId: motionDocketEntryID,
      signedDocketEntryId: newDocketEntryId,
      stampData,
    });

  await applicationContext
    .getUseCases()
    .generateStampedCoversheetInteractor(applicationContext, {
      docketEntryId: motionDocketEntryID,
      docketNumber,
      stampData,
      stampedDocketEntryId: newDocketEntryId,
    });

  const redirectUrl = `/case-detail/${docketNumber}/draft-documents?docketEntryId=${newDocketEntryId}`;

  return {
    docketEntryId,
    docketNumber,
    redirectUrl,
    tab: 'docketRecord',
  };
};
