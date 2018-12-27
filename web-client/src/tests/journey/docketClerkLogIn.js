export default (test, token = 'docketclerk') => {
  return it('the docketclerk logs in', async () => {
    test.setState('user', {
      name: 'Docket Clerk',
      role: 'docketclerk',
      token,
      userId: token,
    });
  });
};
