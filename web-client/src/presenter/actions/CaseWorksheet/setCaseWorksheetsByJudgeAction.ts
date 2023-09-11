import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { state } from '@web-client/presenter/app.cerebral';

export const setCaseWorksheetsByJudgeAction = ({
  props,
  store,
}: ActionProps<{
  worksheets: RawCaseWorksheet[];
}>) => {
  const { worksheets } = props;

  store.set(state.submittedAndCavCases.worksheets, worksheets);
};
