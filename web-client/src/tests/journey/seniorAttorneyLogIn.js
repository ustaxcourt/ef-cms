export default test => {
  return it('the seniorattorney logs in', async () => {
    test.setState('user', {
      name: 'Senior Attorney',
      role: 'seniorattorney',
      token: 'seniorattorney',
      userId: 'seniorattorney',
    });
  });
};
