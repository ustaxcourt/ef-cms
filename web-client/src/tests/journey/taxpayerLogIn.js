export default test => {
  return it('Taxpayer logs in', async () => {
    test.setState('user', {
      name: 'Test Taxpayer',
      role: 'taxpayer',
      token: 'taxpayer',
      userId: 'taxpayer',
    });
  });
};
