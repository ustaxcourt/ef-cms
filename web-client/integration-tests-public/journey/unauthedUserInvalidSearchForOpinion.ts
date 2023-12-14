export const unauthedUserInvalidSearchForOpinion = cerebralTest => {
  return it('Search for opinion without a keyword', async () => {
    await cerebralTest.runSequence('gotoPublicSearchSequence');

    await cerebralTest.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });
};
