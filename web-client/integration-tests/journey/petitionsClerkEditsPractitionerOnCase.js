import { EditPractitionerFactory } from '../../../shared/src/business/entities/caseAssociation/EditPractitionerFactory';

const { VALIDATION_ERROR_MESSAGES } = EditPractitionerFactory;

export default test => {
  return it('Petitions clerk edits a practitioner on a case', async () => {
    expect(test.getState('caseDetail.practitioners').length).toEqual(2);

    await test.runSequence('openEditPractitionersModalSequence');

    expect(
      test.getState('modal.practitioners.1.representingPrimary'),
    ).toBeFalsy();
    expect(
      test.getState('modal.practitioners.1.representingSecondary'),
    ).toEqual(true);

    await test.runSequence('updateModalValueSequence', {
      key: 'practitioners.1.representingSecondary',
      value: false,
    });

    await test.runSequence('submitEditPractitionersModalSequence');

    expect(test.getState('validationErrors.practitioners.0')).toBeFalsy();
    expect(test.getState('validationErrors.practitioners.1')).toEqual({
      representingPrimary: VALIDATION_ERROR_MESSAGES.representingPrimary,
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'practitioners.1.representingPrimary',
      value: true,
    });
    await test.runSequence('updateModalValueSequence', {
      key: 'practitioners.1.representingSecondary',
      value: true,
    });

    await test.runSequence('submitEditPractitionersModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('caseDetail.practitioners.length')).toEqual(2);
    expect(
      test.getState('caseDetail.practitioners.1.representingPrimary'),
    ).toEqual(true);
    expect(
      test.getState('caseDetail.practitioners.1.representingSecondary'),
    ).toEqual(true);
  });
};
