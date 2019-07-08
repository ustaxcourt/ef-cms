import { caseDetailHelper } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';

export default (test, overrides = {}) => {
  return it('Petitions clerk deletes a case deadline', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });

    await test.runSequence('openDeleteCaseDeadlineModalSequence', {
      caseDeadlineId: helper.caseDeadlines[0].caseDeadlineId,
    });

    expect(test.getState('form.caseDeadlineId')).toBeTruthy();
    expect(test.getState('form.month')).toBeTruthy();
    expect(test.getState('form.day')).toBeTruthy();
    expect(test.getState('form.year')).toBeTruthy();
    expect(test.getState('form.description')).toBeTruthy();

    await test.runSequence('deleteCaseDeadlineSequence');
  });
};
