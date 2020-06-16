import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkAddsPractitionersToCase = (test, skipSecondary) => {
  return it('Petitions clerk manually adds multiple privatePractitioners to case', async () => {
    const practitionerBarNumber = test.barNumber || 'PT1234';

    expect(test.getState('caseDetail.privatePractitioners')).toEqual([]);

    await test.runSequence('openAddPrivatePractitionerModalSequence');

    expect(
      test.getState('validationErrors.practitionerSearchError'),
    ).toBeDefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'practitionerSearch',
      value: practitionerBarNumber,
    });

    await test.runSequence('openAddPrivatePractitionerModalSequence');

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

    await test.runSequence('associatePrivatePractitionerWithCaseSequence');

    expect(test.getState('caseDetail.privatePractitioners.length')).toEqual(1);
    expect(
      test.getState('caseDetail.privatePractitioners.0.representingPrimary'),
    ).toEqual(true);
    expect(test.getState('caseDetail.privatePractitioners.0.name')).toEqual(
      practitionerMatch.name,
    );

    let formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.privatePractitioners.length).toEqual(1);
    expect(formatted.privatePractitioners[0].formattedName).toEqual(
      `${practitionerMatch.name} (${practitionerMatch.barNumber})`,
    );

    //add a second practitioner
    if (!skipSecondary) {
      await test.runSequence('updateFormValueSequence', {
        key: 'practitionerSearch',
        value: 'PT5432',
      });
      await test.runSequence('openAddPrivatePractitionerModalSequence');

      expect(test.getState('modal.practitionerMatches.length')).toEqual(1);
      practitionerMatch = test.getState('modal.practitionerMatches.0');
      expect(test.getState('modal.user.userId')).toEqual(
        practitionerMatch.userId,
      );

      await test.runSequence('updateModalValueSequence', {
        key: 'representingSecondary',
        value: true,
      });

      await test.runSequence('associatePrivatePractitionerWithCaseSequence');
      expect(test.getState('caseDetail.privatePractitioners.length')).toEqual(
        2,
      );
      expect(
        test.getState(
          'caseDetail.privatePractitioners.1.representingSecondary',
        ),
      ).toEqual(true);
      expect(test.getState('caseDetail.privatePractitioners.1.name')).toEqual(
        practitionerMatch.name,
      );

      formatted = runCompute(formattedCaseDetail, {
        state: test.getState(),
      });

      expect(formatted.privatePractitioners.length).toEqual(2);
      expect(formatted.privatePractitioners[1].formattedName).toEqual(
        `${practitionerMatch.name} (${practitionerMatch.barNumber})`,
      );
    }
  });
};
