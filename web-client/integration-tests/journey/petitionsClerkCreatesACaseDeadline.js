import { CaseDeadline } from '../../../shared/src/business/entities/CaseDeadline';

const { VALIDATION_ERROR_MESSAGES } = CaseDeadline;

export const petitionsClerkCreatesACaseDeadline = (test, overrides = {}) => {
  return it('Petitions clerk creates a case deadline', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openCreateCaseDeadlineModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('createCaseDeadlineSequence');

    expect(test.getState('validationErrors')).toEqual({
      deadlineDate: VALIDATION_ERROR_MESSAGES.deadlineDate,
      description: VALIDATION_ERROR_MESSAGES.description[1],
    });

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
      value: overrides.month || '8',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: overrides.day || '12',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'year',
      value: overrides.year || '2025',
    });

    await test.runSequence('validateCaseDeadlineSequence');

    expect(test.getState('validationErrors')).toEqual({
      description: VALIDATION_ERROR_MESSAGES.description[0].message,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'description',
      value: overrides.description || "We're talking away...",
    });

    await test.runSequence('validateCaseDeadlineSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('createCaseDeadlineSequence');
  });
};
