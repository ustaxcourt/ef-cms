export const practitionerVerifiesCasePractitionerAssociation = (
  cerebralTest,
  casePractitionerAssociationExists = true,
) => {
  return it('Check practitioner can still practice law stuff on this case', () => {
    const privatePractitioners = cerebralTest.getState(
      'caseDetail.privatePractitioners',
    );

    const currentUser = cerebralTest.getState('user');

    casePractitionerAssociationExists
      ? expect(privatePractitioners).toContainEqual(
          expect.objectContaining({ userId: currentUser.userId }),
        )
      : expect(privatePractitioners).not.toContainEqual(
          expect.objectContaining({ userId: currentUser.userId }),
        );
  });
};
