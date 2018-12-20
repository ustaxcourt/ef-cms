export default test => {
  return it('the docketclerk logs in', async () => {
    test.setState('user', {
      name: 'Docket Clerk',
      role: 'docketclerk',
      token: 'docketclerk',
      userId: 'docketclerk',
    });
  });
};
