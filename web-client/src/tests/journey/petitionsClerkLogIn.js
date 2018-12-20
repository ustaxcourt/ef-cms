export default test => {
  return it('Petitions clerk logs in', async () => {
    test.setState('user', {
      name: 'Petitions Clerk',
      role: 'petitionsclerk',
      token: 'petitionsclerk',
      userId: 'petitionsclerk',
    });
  });
};
