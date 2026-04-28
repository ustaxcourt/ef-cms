import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateCaseWorksheetInteractor = (
  applicationContext: ClientApplicationContext,
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
