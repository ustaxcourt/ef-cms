export const petitionsClerk1VerifiesCaseStatusOnMessage = (
  cerebralTest,
  expectedCaseStatus,
) => {
  return it('Petitions Clerk1 verifies updated caseStatus on messages', () => {
    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.docketNumber === cerebralTest.docketNumber,
    );

    expect(foundMessage.caseStatus).toBe(expectedCaseStatus);
  });
};
