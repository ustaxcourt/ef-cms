import { state } from 'cerebral';
/**
 * get the pdf file and pdf blob url from the passed in htmlString
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the pdfUrl
 */
export const generateDocketRecordPdfUrlAction = async ({
  applicationContext,
  get,
}) => {
  const caseDetail = get(state.caseDetail);
  const docketRecordSort = get(
    state.sessionMetadata.docketRecordSort[caseDetail.docketNumber],
  );

  const {
    url,
  } = await applicationContext.getUseCases().generateDocketRecordPdfInteractor({
    applicationContext,
    docketNumber: caseDetail.docketNumber,
    docketRecordSort,
    includePartyDetail: true,
  });

  return { pdfUrl: url };
};
