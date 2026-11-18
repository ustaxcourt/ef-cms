import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
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
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const docketRecordSort = get(
    state.sessionMetadata.docketRecordSort[caseDetail.docketNumber],
  );

  const docketRecordSortField = get(
    state[STATE_KEYS.DOCKET_RECORD_TABLE_SORT].sortField,
  );
  const docketRecordSortOrder = get(
    state[STATE_KEYS.DOCKET_RECORD_TABLE_SORT].sortOrder,
  );

  const { fileId, url } = await applicationContext
    .getUseCases()
    .generateDocketRecordPdfInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
      docketRecordSort,
      docketRecordTableSort: {
        sortField: docketRecordSortField,
        sortOrder: docketRecordSortOrder,
      },
    });

  return { fileId, pdfUrl: url };
};
