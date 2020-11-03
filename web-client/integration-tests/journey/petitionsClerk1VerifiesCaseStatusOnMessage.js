export const petitionsClerk1VerifiesCaseStatusOnMessage = (
  test,
  expectedCaseStatus,
) => {
  return it('Petitions Clerk1 verifies updated caseStatus on messages', async () => {
    const messages = test.getState('messages');

    const foundMessage = messages.find(
      message => message.docketNumber === test.docketNumber,
    );

    expect(foundMessage.caseStatus).toBe(expectedCaseStatus);
  });
};
