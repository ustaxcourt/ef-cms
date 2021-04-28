export const admissionsClerkVerifiesPractitionerServiceIndicator = (
  test,
  expectedServiceIndicator,
) => {
  return it('admissions clerk verifies practitioner service preference', async () => {
    await test.runSequence('gotoPractitionerDetailSequence', {
      barNumber: test.barNumber,
    });

    expect(test.getState('practitionerDetail').serviceIndicator).toEqual(
      expectedServiceIndicator,
    );
  });
};
