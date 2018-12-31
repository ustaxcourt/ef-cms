export default test => {
  return it('Respondent logs in', async () => {
    test.setState('user', {
      name: 'IRS Attorney',
      role: 'respondent',
      token: 'respondent',
      userId: 'respondent',
    });
  });
};
