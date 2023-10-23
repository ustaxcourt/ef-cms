import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkDeletesCaseDeadline = cerebralTest => {
  const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

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
    expect(cerebralTest.getState('form.deadlineDate')).toBeTruthy();
    expect(cerebralTest.getState('form.description')).toBeTruthy();

    await cerebralTest.runSequence('deleteCaseDeadlineSequence');
  });
};
