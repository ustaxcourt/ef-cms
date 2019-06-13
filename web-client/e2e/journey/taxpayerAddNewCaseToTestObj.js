export default test => {
  return it('[TEST SETUP DATA] Adds the most recent case to the test object', () => {
    if (!Array.isArray(test.taxpayerNewCases)) {
      test.taxpayerNewCases = [];
    }
    const taxpayerNewCase = test.getState('cases.0');
    test.taxpayerNewCases.push(taxpayerNewCase);
    expect(test.taxpayerNewCases.length).toBeGreaterThan(0);
  });
};
