import { Stamp } from '../../../../shared/src/business/entities/Stamp';
import { state } from 'cerebral';

/**
 * generates an action for completing motion stamping
 *
 * @param {object} providers the providers object
 * @param {string} providers.get the cerebral get function
 * @param {string} providers.applicationContext the applicationContext
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
  if (get(state.pdfForSigning.stampData.x)) {
    // make x, y of stamp static
    const {
      nameForSigning,
      nameForSigningLine2,
      stampData: { scale, x, y },
    } = get(state.pdfForSigning);

    const stampEntity = new Stamp(stampFormData);
    const pdfjsObj = window.pdfjsObj || get(state.pdfForSigning.pdfjsObj);

    newDocketEntryId = applicationContext.getUniqueId();

    await applicationContext
      .getUseCases()
      .addDraftStampOrderDocketEntryInteractor(applicationContext, {
        docketNumber,
        originalDocketEntryId: motionDocketEntryID,
        signedDocketEntryId: newDocketEntryId,
        stampData: stampEntity, // maybe not necessary until edit
      });

    // need stamp entity to populate docket entry stamp fields from form
    // need stamp entity to generate the coversheet PDF

    await applicationContext
      .getUseCases()
      .generateStampedCoversheetInteractor(applicationContext, {
        docketEntryId: motionDocketEntryID,
        docketNumber,
        stampData: stampEntity,
        // pdfData: await pdfjsObj.getData(),
      });
  }

  const redirectUrl = `/case-detail/${docketNumber}/draft-documents?docketEntryId=${newDocketEntryId}`;

  return {
    docketEntryId,
    docketNumber,
    redirectUrl,
    tab: 'docketRecord',
  };
};
