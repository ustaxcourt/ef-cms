describe('Fail Fast Test 3', () => {
  it('should pass this test', () => {
    // This test should pass
  });

  it('should fail this test', () => {
    throw new Error('This test is designed to fail for fail-fast testing');
  });

  it('should not run this test if fail-fast works', () => {
    // This test should not run if fail-fast works
  });
});
