import { CaseDeadline } from '../../../shared/src/business/entities/CaseDeadline';
import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

const { VALIDATION_ERROR_MESSAGES } = CaseDeadline;

export default (test, overrides = {}) => {
  return it('Petitions clerk edits a case deadline', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const helper = runCompute(caseDetailHelper, {
      state: test.getState(),
    });

    await test.runSequence('openEditCaseDeadlineModalSequence', {
      caseDeadlineId: helper.caseDeadlines[0].caseDeadlineId,
    });

    expect(test.getState('form.caseDeadlineId')).toBeTruthy();
    expect(test.getState('form.month')).toBeTruthy();
    expect(test.getState('form.day')).toBeTruthy();
    expect(test.getState('form.year')).toBeTruthy();
    expect(test.getState('form.description')).toBeTruthy();

    await test.runSequence('updateFormValueSequence', {
      key: 'description',
      value: `We're talking away
I don't know what
I'm to say I'll say it anyway
Today's another day to find you
Shying away
I'll be coming for your love, okay?

Take on me, (take on me)
Take me on, (take on me)
I'll be gone
In a day or two`,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'month',
      value: overrides.month || '4',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: overrides.day || '1',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'year',
      value: overrides.year || '2035',
    });

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('updateCaseDeadlineSequence');

    expect(test.getState('validationErrors')).toEqual({
      description: VALIDATION_ERROR_MESSAGES.description[0].message,
    });

    await test.runSequence('validateCaseDeadlineSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'description',
      value: overrides.description || "We're talking away another day...",
    });

    await test.runSequence('validateCaseDeadlineSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('updateCaseDeadlineSequence');
  });
};
