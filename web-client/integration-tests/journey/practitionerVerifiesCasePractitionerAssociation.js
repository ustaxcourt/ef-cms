export const practitionerVerifiesCasePractitionerAssociation = (
  cerebralTest,
  casePractitionerAssociationExists = true,
) => {
  return it('Check whether practitioner still appears in privatePractitioner array on case', () => {
    const privatePractitioners = cerebralTest.getState(
      'caseDetail.privatePractitioners',
    );

    const currentUser = cerebralTest.getState('user');

    if (casePractitionerAssociationExists) {
      expect(privatePractitioners).toContainEqual(
        expect.objectContaining({ userId: currentUser.userId }),
      );
    } else {
      expect(privatePractitioners).not.toContainEqual(
        expect.objectContaining({ userId: currentUser.userId }),
      );
    }
  });
};
