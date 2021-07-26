export const petitionsClerkEditsSavedPetition = cerebralTest => {
  return it('Petitions Clerk edits saved petition', async () => {
    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
      tab: 'IrsNotice',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PetitionQc');
  });
};
