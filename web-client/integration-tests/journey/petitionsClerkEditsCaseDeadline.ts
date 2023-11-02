import { FORMATS } from '@shared/business/utilities/DateHandler';
import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkEditsCaseDeadline = (
  cerebralTest,
  overrides = {},
) => {
  const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

  return it('Petitions clerk edits a case deadline', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const helper = runCompute(caseDetailHelper, {
      state: cerebralTest.getState(),
    });

    await cerebralTest.runSequence('openEditCaseDeadlineModalSequence', {
      caseDeadlineId: helper.caseDeadlines[0].caseDeadlineId,
    });

    expect(cerebralTest.getState('form.caseDeadlineId')).toBeTruthy();
    expect(cerebralTest.getState('form.deadlineDate')).toBeTruthy();
    expect(cerebralTest.getState('form.description')).toBeTruthy();

    await cerebralTest.runSequence('updateFormValueSequence', {
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

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'deadlineDate',
        toFormat: FORMATS.ISO,
        value: '04/01/2035',
      },
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateCaseDeadlineSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      description:
        'The description is too long. Please enter a valid description.',
    });

    await cerebralTest.runSequence('validateCaseDeadlineSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'description',
      value: overrides.description || "We're talking away another day...",
    });

    await cerebralTest.runSequence('validateCaseDeadlineSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateCaseDeadlineSequence');
  });
};
