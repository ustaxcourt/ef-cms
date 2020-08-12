export const petitionsClerkEditsSavedPetition = test => {
  return it('Petitions Clerk edits saved petition', async () => {
    await test.runSequence('gotoPetitionQcSequence', {
      docketNumber: test.docketNumber,
      tab: 'IrsNotice',
    });

    expect(test.getState('currentPage')).toEqual('PetitionQc');
  });
};
