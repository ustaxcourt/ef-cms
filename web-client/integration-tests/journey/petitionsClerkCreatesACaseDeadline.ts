import { CaseDeadline } from '../../../shared/src/business/entities/CaseDeadline';
import { refreshElasticsearchIndex } from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = CaseDeadline;

export const petitionsClerkCreatesACaseDeadline = (
  cerebralTest,
  overrides = {},
) => {
  return it('Petitions clerk creates a case deadline', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openCreateCaseDeadlineModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('createCaseDeadlineSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      deadlineDate: VALIDATION_ERROR_MESSAGES.deadlineDate,
      description: VALIDATION_ERROR_MESSAGES.description[1],
    });

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

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'month',
      value: overrides.month || '8',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'day',
      value: overrides.day || '12',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'year',
      value: overrides.year || '2025',
    });

    await cerebralTest.runSequence('validateCaseDeadlineSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      description: VALIDATION_ERROR_MESSAGES.description[0].message,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'description',
      value: overrides.description || "We're talking away...",
    });

    await cerebralTest.runSequence('validateCaseDeadlineSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('createCaseDeadlineSequence');

    await refreshElasticsearchIndex();
  });
};
