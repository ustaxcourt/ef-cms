import { state } from 'cerebral';
import Stamp from '../../../../shared/src/business/entities/Stamp';

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
  const originalDocketEntryId = get(state.pdfForSigning.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  const stampFormData = get(state.form);
  const parentMessageId = get(state.parentMessageId);
  let docketEntryId;

  // todo: update this
  await applicationContext
    .getUseCases()
    .generateDraftStampOrderInteractor(applicationContext, {});

  //   docketEntryId: "9cbbc9c4-1451-4f53-893c-aa2d9bbb20c4"
  // isPdfAlreadySigned: true
  // nameForSigning: "Mary Ann Cohen"
  // nameForSigningLine2: "Judge"
  // pageNumber: 1
  // pdfjsObj: PDFDocumentProxy {_pdfInfo: {…}, _transport: WorkerTransport, getStats: ƒ}
  // signatureApplied: false
  // signatureData: null
  // stampApplied: true
  // stampData: {scale: 1, x: 81.796875, y: 485

  // this is stamp entity
  //   customText: "acSDfbgnhnfbdsvca"
  // date: "2022-07-16T04:00:00.000Z"
  // day: "16"
  // deniedAsMoot: true
  // deniedWithoutPrejudice: true
  // disposition: "Denied"
  // dueDateMessage: "The parties shall file a status report or proposed stipulated decision by"
  // jurisdictionalOption: "Jurisdiction is retained by the undersigned"
  // month: "07"
  // strickenFromTrialSession: "This case is stricken from the trial session"
  // year: "2022"

  if (get(state.pdfForSigning.stampData.x)) {
    const {
      nameForSigning,
      nameForSigningLine2,
      stampData: { scale, x, y },
    } = get(state.pdfForSigning);
    console.log('x in the complete action!!!!!', x); // matches what's x from ApplyStamp (80x; og x = 80)
    console.log('y in the complete aaaaaction! yyyyyy', y); // subtracts height of the stamp ~ (492y; og y = 620)

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

    const signedDocumentFromUploadId = await applicationContext
      .getPersistenceGateway()
      .uploadDocumentFromClient({
        applicationContext,
        document: documentFile,
      });

    ({ signedDocketEntryId: docketEntryId } = await applicationContext
      .getUseCases()
      .saveSignedDocumentInteractor(applicationContext, {
        docketNumber,
        nameForSigning,
        originalDocketEntryId,
        parentMessageId,
        signedDocketEntryId: signedDocumentFromUploadId,
      }));
  }

  //generate draft stanmo order form motion coversheet

  // let redirectUrl;
  //verify if redirect
  // if (parentMessageId) {
  //   redirectUrl = `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${originalDocketEntryId}`;
  // } else {
  //change to drafts later
  let redirectUrl = `/case-detail/${docketNumber}`;
  // }

  return {
    docketEntryId,
    docketNumber,
    redirectUrl,
    tab: 'docketRecord',
  };
};
