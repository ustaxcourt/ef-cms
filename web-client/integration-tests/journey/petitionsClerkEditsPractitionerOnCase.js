import { EditPetitionerCounselFactory } from '../../../shared/src/business/entities/caseAssociation/EditPetitionerCounselFactory';
import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = EditPetitionerCounselFactory;

export const petitionsClerkEditsPractitionerOnCase = cerebralTest => {
  return it('Petitions clerk edits a practitioner on a case', async () => {
    expect(
      cerebralTest.getState('caseDetail.privatePractitioners').length,
    ).toEqual(2);

    const barNumber = cerebralTest.getState(
      'caseDetail.privatePractitioners.1.barNumber',
    );

    await cerebralTest.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: cerebralTest.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    const contactSecondary = contactSecondaryFromState(cerebralTest);

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
      representing: VALIDATION_ERROR_MESSAGES.representing,
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

    expect(
      cerebralTest.getState('caseDetail.privatePractitioners.1.representing'),
    ).toEqual([contactSecondary.contactId, contactPrimary.contactId]);
  });
};
