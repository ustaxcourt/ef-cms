import { runCompute } from 'cerebral/test';
import { startCaseHelper as startCaseHelperComputed } from '../../src/presenter/computeds/startCaseHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const startCaseHelper = withAppContextDecorator(startCaseHelperComputed);

export const petitionerChoosesProcedureType = (
  cerebralTest,
  overrides = {},
) => {
  it('petitioner chooses the procedure types to get the trial cities', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');
    let helper = runCompute(startCaseHelper, {
      state: cerebralTest.getState(),
    });
    expect(helper.showSmallTrialCitiesHint).toBe(false);
    expect(helper.showRegularTrialCitiesHint).toBe(false);
    expect(cerebralTest.getState('form.preferredTrialCity')).toEqual(undefined);
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: overrides.procedureType || 'Small',
    });
    helper = runCompute(startCaseHelper, {
      state: cerebralTest.getState(),
    });
    if (overrides.procedureType === 'Regular') {
      expect(helper.showSmallTrialCitiesHint).toBe(false);
      expect(helper.showRegularTrialCitiesHint).toBe(true);
    } else {
      expect(helper.showSmallTrialCitiesHint).toBe(true);
      expect(helper.showRegularTrialCitiesHint).toBe(false);
    }
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: overrides.preferredTrialCity || 'Seattle, Washington',
    });
  });
};
