export default test => {
  return it('[TEST SETUP DATA] Adds the most recent case to the test object', () => {
    if (!Array.isArray(test.petitionerNewCases)) {
      test.petitionerNewCases = [];
    }
    const petitionerNewCase = test.getState('cases.0');
    test.petitionerNewCases.push(petitionerNewCase);
    expect(test.petitionerNewCases.length).toBeGreaterThan(0);
  });
};
