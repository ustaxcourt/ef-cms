import { clearOptionalCustomCaseReportFilterAction } from './clearOptionalCustomCaseReportFilterAction';
import { cloneDeep } from 'lodash';
import { initialCustomCaseReportState } from '../../customCaseReportState';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearOptionalCustomCaseReportFilterAction', () => {
  it('should set case statues and caseTypes to empty arrays', async () => {
    const CustomCaseReportState = cloneDeep(initialCustomCaseReportState);
    CustomCaseReportState.filters.caseStatuses = ['CAV'];
    CustomCaseReportState.filters.caseTypes = ['CDP (Lien/Levy)'];
    CustomCaseReportState.filters.judges = ['Buch'];
    CustomCaseReportState.filters.preferredTrialCities = ['Detroit, Michigan'];

    const result = await runAction(clearOptionalCustomCaseReportFilterAction, {
      state: { customCaseReport: CustomCaseReportState },
    });

    expect(result.state.customCaseReport.filters.caseStatuses).toEqual([]);
    expect(result.state.customCaseReport.filters.caseTypes).toEqual([]);
    expect(result.state.customCaseReport.filters.judges).toEqual([]);
    expect(result.state.customCaseReport.filters.preferredTrialCities).toEqual(
      [],
    );
  });
});
