import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { post } from '../requests';

export const updateCaseWorksheetInteractor = (
  applicationContext,
  {
    worksheet,
  }: {
    worksheet: RawCaseWorksheet;
  },
) => {
  return post({
    applicationContext,
    body: { worksheet },
    endpoint: `/cases/${worksheet.docketNumber}/case-worksheet`,
  });
};
