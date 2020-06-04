import { EditPrivatePractitionerFactory } from '../../../shared/src/business/entities/caseAssociation/EditPrivatePractitionerFactory';

const { VALIDATION_ERROR_MESSAGES } = EditPrivatePractitionerFactory;

export const petitionsClerkEditsPractitionerOnCase = test => {
  return it('Petitions clerk edits a practitioner on a case', async () => {
    expect(test.getState('caseDetail.privatePractitioners').length).toEqual(2);

    await test.runSequence('openEditPrivatePractitionersModalSequence');

    expect(
      test.getState('modal.privatePractitioners.1.representingPrimary'),
    ).toBeFalsy();
    expect(
      test.getState('modal.privatePractitioners.1.representingSecondary'),
    ).toEqual(true);

    await test.runSequence('updateModalValueSequence', {
      key: 'privatePractitioners.1.representingSecondary',
      value: false,
    });

    await test.runSequence('submitEditPrivatePractitionersModalSequence');

    expect(
      test.getState('validationErrors.privatePractitioners.0'),
    ).toBeFalsy();
    expect(test.getState('validationErrors.privatePractitioners.1')).toEqual({
      representingPrimary: VALIDATION_ERROR_MESSAGES.representingPrimary,
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'privatePractitioners.1.representingPrimary',
      value: true,
    });
    await test.runSequence('updateModalValueSequence', {
      key: 'privatePractitioners.1.representingSecondary',
      value: true,
    });

    await test.runSequence('submitEditPrivatePractitionersModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.privatePractitioners.length')).toEqual(2);
    expect(
      test.getState('caseDetail.privatePractitioners.1.representingPrimary'),
    ).toEqual(true);
    expect(
      test.getState('caseDetail.privatePractitioners.1.representingSecondary'),
    ).toEqual(true);
  });
};
