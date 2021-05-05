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

    expect(test.getState('form.representingPrimary')).toBeFalsy();
    expect(test.getState('form.representingSecondary')).toBeTruthy();
    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('currentPage')).toEqual('EditPetitionerCounsel');

    await test.runSequence('updateFormValueSequence', {
      key: 'representingSecondary',
      value: false,
    });

    await test.runSequence('submitEditPetitionerCounselSequence');

    expect(test.getState('validationErrors')).toEqual({
      representingPrimary: VALIDATION_ERROR_MESSAGES.representingPrimary,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'representingPrimary',
      value: true,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'representingSecondary',
      value: true,
    });

    await test.runSequence('submitEditPetitionerCounselSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.privatePractitioners.length')).toEqual(2);
    const contactPrimary = contactPrimaryFromState(test);
    const contactSecondary = contactSecondaryFromState(test);

    expect(
      test.getState('caseDetail.privatePractitioners.1.representing'),
    ).toEqual([contactPrimary.contactId, contactSecondary.contactId]);
  });
};
