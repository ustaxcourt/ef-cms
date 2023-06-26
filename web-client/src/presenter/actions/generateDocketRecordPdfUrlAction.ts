import { state } from '@web-client/presenter/app.cerebral';
/**
 * get the pdf file and pdf blob url from the passed in htmlString
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {object} the pdfUrl
 */
export const generateDocketRecordPdfUrlAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const docketRecordSort = get(
    state.sessionMetadata.docketRecordSort[caseDetail.docketNumber],
  );
  const { isAssociated } = props;

  let includePartyDetail = false;
  let isIndirectlyAssociated = false;
  if (isAssociated) {
    includePartyDetail = true;
    isIndirectlyAssociated = true;
  }

  const { url } = await applicationContext
    .getUseCases()
    .generateDocketRecordPdfInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
      docketRecordSort,
      includePartyDetail,
      isIndirectlyAssociated,
    });

  return { pdfUrl: url };
};
