import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { state } from '@web-client/presenter/app.cerebral';

export const setCaseWorksheetAction = ({
  get,
  props,
  store,
}: ActionProps<{ updatedWorksheet: RawCaseWorksheet }>) => {
  const { updatedWorksheet } = props;

  const { submittedAndCavCasesByJudge } = get(state.submittedAndCavCases);

  const caseIndex = submittedAndCavCasesByJudge.findIndex(
    ws => ws.docketNumber === updatedWorksheet.docketNumber,
  );

  store.set(
    state.submittedAndCavCases.submittedAndCavCasesByJudge[caseIndex]
      .caseWorksheet,
    updatedWorksheet,
  );
};
