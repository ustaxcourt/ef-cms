export default (test, overrides = {}) => {
  return it('Petitions clerk creates a case deadline', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openCreateCaseDeadlineSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('createCaseDeadlineSequence');

    expect(test.getState('validationErrors')).toEqual({
      deadlineDate: 'Please enter a valid deadline date.',
      description: 'Please enter a description.',
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
      value: '8',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '12',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'year',
      value: '2025',
    });

    await test.runSequence('validateCaseDeadlineSequence');

    expect(test.getState('validationErrors')).toEqual({
      description:
        'The description is too long. Please enter a valid description.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'description',
      value: "We're talking away...",
    });

    await test.runSequence('validateCaseDeadlineSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('createCaseDeadlineSequence');
  });
};
