import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { state } from '@web-client/presenter/app.cerebral';

export const setAddEditCaseWorksheetModalStateAction = ({
  get,
  props,
  store,
}: ActionProps<{
  docketNumber: string;
}>) => {
  const { docketNumber } = props;

  const { submittedAndCavCasesByJudge } = get(state.submittedAndCavCases);

  const caseWorksheet: Partial<RawCaseWorksheet> & { docketNumber: string } =
    submittedAndCavCasesByJudge.find(ws => ws.docketNumber === docketNumber)
      ?.caseWorksheet || { docketNumber };

  store.set(state.form, {
    ...caseWorksheet,
    ...(caseWorksheet.finalBriefDueDate && {
      finalBriefDueDate: formatDateString(
        caseWorksheet.finalBriefDueDate,
        FORMATS.YYYYMMDD,
      ),
    }),
  });
};
