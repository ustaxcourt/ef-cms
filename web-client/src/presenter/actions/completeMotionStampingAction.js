// import { Stamp } from '../../../../shared/src/business/entities/Stamp';
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
  const motionDocketEntry = get(state.pdfForSigning.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  // todo: add actual stamp data to save onto draft generated order
  // const stampFormData = get(state.form);
  const parentMessageId = get(state.parentMessageId);
  let docketEntryId;

  if (get(state.pdfForSigning.stampData.x)) {
    const {
      nameForSigning,
      nameForSigningLine2,
      stampData: { scale, x, y },
    } = get(state.pdfForSigning);

    // const stampEntity = new Stamp(stampFormData);

    const pdfjsObj = window.pdfjsObj || get(state.pdfForSigning.pdfjsObj);

    const stampedPdfBytes = await applicationContext
      .getUseCases()
      .generateStampedDocumentInteractor(applicationContext, {
        pdfData: await pdfjsObj.getData(),
        posX: x,
        posY: y,
        scale,
        sigTextData: {
          signatureName: `(Signed) ${nameForSigning}`,
          signatureTitle: nameForSigningLine2,
        },
        stampEntity: {},
      });

    const documentFile = new File([stampedPdfBytes], 'myfile.pdf', {
      type: 'application/pdf',
    });

    const stampedDocumentFromUploadId = await applicationContext
      .getPersistenceGateway()
      .uploadDocumentFromClient({
        applicationContext,
        document: documentFile,
      });

    ({ signedDocketEntryId: docketEntryId } = await applicationContext
      .getUseCases()
      .saveSignedDocumentInteractor(applicationContext, {
        docketNumber,
        isMotion: true,
        nameForSigning,
        originalDocketEntryId: motionDocketEntry,
        parentMessageId,
        signedDocketEntryId: stampedDocumentFromUploadId,
      }));
    // persist the stamp data since we'll have access to the generated order's docketEntryId
    // other option would be storing stamp on DE, but would require a migration if non-optional
  }

  const redirectUrl = `/case-detail/${docketNumber}/draft-documents?docketEntryId=${docketEntryId}`;

  return {
    docketEntryId,
    docketNumber,
    redirectUrl,
    tab: 'docketRecord',
  };
};
