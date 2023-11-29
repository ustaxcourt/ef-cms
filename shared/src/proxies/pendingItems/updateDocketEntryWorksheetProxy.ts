import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { post } from '../requests';

export const updateDocketEntryWorksheetInteractor = (
  applicationContext,
  {
    worksheet,
  }: {
    worksheet: RawDocketEntryWorksheet;
  },
) => {
  return post({
    applicationContext,
    body: { worksheet },
    endpoint: `/docket-entry/${worksheet.docketEntryId}/worksheet`,
  });
};
