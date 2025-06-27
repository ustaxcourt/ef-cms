import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';

export const petitionsClerkEditsPractitionerOnCase = cerebralTest => {
  return it('Petitions clerk edits a practitioner on a case', async () => {
    expect(
      cerebralTest.getState('caseDetail.privatePractitioners').length,
    ).toEqual(2);

    const privatePractitioners = cerebralTest.getState(
      'caseDetail.privatePractitioners',
    );

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    const contactSecondary = contactSecondaryFromState(cerebralTest);

    const { barNumber } = privatePractitioners.find(p => {
      return p.representing.includes(contactSecondary.contactId);
    });

    await cerebralTest.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(
      cerebralTest.getState(`form.representingMap.${contactPrimary.contactId}`),
    ).toBeFalsy();
    expect(
      cerebralTest.getState(
        `form.representingMap.${contactSecondary.contactId}`,
      ),
    ).toBeTruthy();
    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditPetitionerCounsel',
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: `representingMap.${contactSecondary.contactId}`,
      value: false,
    });

    await cerebralTest.runSequence('submitEditPetitionerCounselSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      representing: 'Select a representing party',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: `representingMap.${contactPrimary.contactId}`,
      value: true,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: `representingMap.${contactSecondary.contactId}`,
      value: true,
    });

    await cerebralTest.runSequence('submitEditPetitionerCounselSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(
      cerebralTest.getState('caseDetail.privatePractitioners.length'),
    ).toEqual(2);

    const practitionerRepresenting = cerebralTest
      .getState('caseDetail.privatePractitioners')
      .find(p => {
        return p.barNumber === barNumber;
      }).representing;

    expect(practitionerRepresenting).toEqual([
      contactSecondary.contactId,
      contactPrimary.contactId,
    ]);
  });
};
