import { EditPetitionerCounselFactory } from '../../../shared/src/business/entities/caseAssociation/EditPetitionerCounselFactory';
import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = EditPetitionerCounselFactory;

export const petitionsClerkEditsPractitionerOnCase = test => {
  return it('Petitions clerk edits a practitioner on a case', async () => {
    expect(test.getState('caseDetail.privatePractitioners').length).toEqual(2);

    const barNumber = test.getState(
      'caseDetail.privatePractitioners.1.barNumber',
    );

    await test.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: test.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(test);
    const contactSecondary = contactSecondaryFromState(test);

    expect(
      test.getState(`form.representingMap.${contactPrimary.contactId}`),
    ).toBeFalsy();
    expect(
      test.getState(`form.representingMap.${contactSecondary.contactId}`),
    ).toBeTruthy();
    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('currentPage')).toEqual('EditPetitionerCounsel');

    await test.runSequence('updateFormValueSequence', {
      key: `representingMap.${contactSecondary.contactId}`,
      value: false,
    });

    await test.runSequence('submitEditPetitionerCounselSequence');

    expect(test.getState('validationErrors')).toEqual({
      representing: VALIDATION_ERROR_MESSAGES.representing,
    });

    await test.runSequence('updateFormValueSequence', {
      key: `representingMap.${contactPrimary.contactId}`,
      value: true,
    });
    await test.runSequence('updateFormValueSequence', {
      key: `representingMap.${contactSecondary.contactId}`,
      value: true,
    });

    await test.runSequence('submitEditPetitionerCounselSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.privatePractitioners.length')).toEqual(2);

    expect(
      test.getState('caseDetail.privatePractitioners.1.representing'),
    ).toEqual([contactSecondary.contactId, contactPrimary.contactId]);
  });
};
