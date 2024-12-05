import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app-public.cerebral';
/**
 * invokes the generate public docket record endpoint to get back the pdf url
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the pdfUrl
 */
export const generatePublicDocketRecordPdfUrlAction = async ({
  applicationContext,
  get,
}: ActionProps<{}, ClientPublicApplicationContext>) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const docketRecordSortField = get(
    state[STATE_KEYS.DOCKET_RECORD_TABLE_SORT].sortField,
  );
  const docketRecordSortOrder = get(
    state[STATE_KEYS.DOCKET_RECORD_TABLE_SORT].sortOrder,
  );

  const { url } = await applicationContext
    .getUseCases()
    .generatePublicDocketRecordPdfInteractor(applicationContext, {
      docketNumber,
      docketRecordTableSort: {
        sortField: docketRecordSortField,
        sortOrder: docketRecordSortOrder,
      },
    });

  return { pdfUrl: url };
};
