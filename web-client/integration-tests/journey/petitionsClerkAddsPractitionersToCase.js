import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export default test => {
  return it('Petitions clerk manually adds multiple practitioners to case', async () => {
    expect(test.getState('caseDetail.practitioners')).toEqual([]);

    await test.runSequence('openAddPractitionerModalSequence');

    expect(
      test.getState('validationErrors.practitionerSearchError'),
    ).toBeDefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'practitionerSearch',
      value: 'PT1234',
    });

    await test.runSequence('openAddPractitionerModalSequence');

    expect(
      test.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();
    expect(test.getState('modal.practitionerMatches.length')).toEqual(1);

    //default selected because there was only 1 match
    let practitionerMatch = test.getState('modal.practitionerMatches.0');
    expect(test.getState('modal.user.userId')).toEqual(
      practitionerMatch.userId,
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'representingPrimary',
      value: true,
    });

    await test.runSequence('associatePractitionerWithCaseSequence');

    expect(test.getState('caseDetail.practitioners.length')).toEqual(1);
    expect(
      test.getState('caseDetail.practitioners.0.representingPrimary'),
    ).toEqual(true);
    expect(test.getState('caseDetail.practitioners.0.name')).toEqual(
      practitionerMatch.name,
    );

    let formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.practitioners.length).toEqual(1);
    expect(formatted.practitioners[0].formattedName).toEqual(
      `${practitionerMatch.name} (${practitionerMatch.barNumber})`,
    );

    //add a second practitioner
    await test.runSequence('updateFormValueSequence', {
      key: 'practitionerSearch',
      value: 'PT5432',
    });
    await test.runSequence('openAddPractitionerModalSequence');

    expect(test.getState('modal.practitionerMatches.length')).toEqual(1);
    practitionerMatch = test.getState('modal.practitionerMatches.0');
    expect(test.getState('modal.user.userId')).toEqual(
      practitionerMatch.userId,
    );

    await test.runSequence('updateModalValueSequence', {
      key: 'representingSecondary',
      value: true,
    });

    await test.runSequence('associatePractitionerWithCaseSequence');
    expect(test.getState('caseDetail.practitioners.length')).toEqual(2);
    expect(
      test.getState('caseDetail.practitioners.1.representingSecondary'),
    ).toEqual(true);
    expect(test.getState('caseDetail.practitioners.1.name')).toEqual(
      practitionerMatch.name,
    );

    formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.practitioners.length).toEqual(2);
    expect(formatted.practitioners[1].formattedName).toEqual(
      `${practitionerMatch.name} (${practitionerMatch.barNumber})`,
    );
  });
};
