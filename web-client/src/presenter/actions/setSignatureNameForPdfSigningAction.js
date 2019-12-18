import { state } from 'cerebral';

/**
 * sets the name to be used for signing a pdf
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext contains the getChiefJudgeNameForSigning method we will use to get the chief judge's name
 * @param {object} providers.store the cerebral store object used for setting pdfForSigning.nameForSigning
 */
export const setSignatureNameForPdfSigningAction = ({
  applicationContext,
  store,
}) => {
  const nameForPdfSigning = applicationContext.getChiefJudgeNameForSigning();
  store.set(state.pdfForSigning.nameForSigning, nameForPdfSigning);
};
