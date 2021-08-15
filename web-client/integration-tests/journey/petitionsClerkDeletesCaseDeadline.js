import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

export const petitionsClerkDeletesCaseDeadline = cerebralTest => {
  return it('Petitions clerk deletes a case deadline', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const helper = runCompute(caseDetailHelper, {
      state: cerebralTest.getState(),
    });

    await cerebralTest.runSequence('openDeleteCaseDeadlineModalSequence', {
      caseDeadlineId: helper.caseDeadlines[0].caseDeadlineId,
    });

    expect(cerebralTest.getState('form.caseDeadlineId')).toBeTruthy();
    expect(cerebralTest.getState('form.month')).toBeTruthy();
    expect(cerebralTest.getState('form.day')).toBeTruthy();
    expect(cerebralTest.getState('form.year')).toBeTruthy();
    expect(cerebralTest.getState('form.description')).toBeTruthy();

    await cerebralTest.runSequence('deleteCaseDeadlineSequence');
  });
};
