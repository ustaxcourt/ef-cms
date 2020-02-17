import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setSelectedCasesForConsolidatedCaseDocumentSubmissionAction } from './setSelectedCasesForConsolidatedCaseDocumentSubmissionAction';

describe('setSelectedCasesForConsolidatedCaseDocumentSubmissionAction', () => {
  it('should update selectedCases when multiple cases are selected', async () => {
    const result = await runAction(
      setSelectedCasesForConsolidatedCaseDocumentSubmissionAction,
      {
        modules: { presenter },
        state: {
          caseDetail: { docketNumber: '101-19' },
          modal: { casesToFileDocument: { '101-19': true, '102-19': true } },
        },
      },
    );

    expect(result.state.form).toEqual({ selectedCases: ['101-19', '102-19'] });
  });

  it("should update selectedCases when the single case selected isn't the base navigated case", async () => {
    const result = await runAction(
      setSelectedCasesForConsolidatedCaseDocumentSubmissionAction,
      {
        modules: { presenter },
        state: {
          caseDetail: { docketNumber: '102-19' },
          modal: { casesToFileDocument: { '101-19': true, '102-19': false } },
        },
      },
    );

    expect(result.state.form).toEqual({ selectedCases: ['101-19'] });
  });

  it('should not update selectedCases when the single case selected is the base navigated case', async () => {
    const result = await runAction(
      setSelectedCasesForConsolidatedCaseDocumentSubmissionAction,
      {
        modules: { presenter },
        state: {
          caseDetail: { docketNumber: '101-19' },
          modal: {
            casesToFileDocument: { '101-19': true, '102-19': false },
          },
        },
      },
    );

    expect(result.state.form).toEqual();
  });
});
