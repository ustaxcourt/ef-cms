export const admissionsClerkVerifiesPractitionerServiceIndicator = (
  cerebralTest,
  expectedServiceIndicator,
) => {
  return it('admissions clerk verifies practitioner service preference', async () => {
    await cerebralTest.runSequence('gotoPractitionerDetailSequence', {
      barNumber: cerebralTest.barNumber,
    });

    expect(
      cerebralTest.getState('practitionerDetail').serviceIndicator,
    ).toEqual(expectedServiceIndicator);
  });
};
