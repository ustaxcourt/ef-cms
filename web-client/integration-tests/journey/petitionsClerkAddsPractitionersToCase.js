import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkAddsPractitionersToCase = (test, skipSecondary) => {
  return it('Petitions clerk manually adds multiple privatePractitioners to case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

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

    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });
    const contactPrimary = formattedCase.petitioners[0];

    await test.runSequence('updateModalValueSequence', {
      key: `representingMap.${contactPrimary.contactId}`,
      value: true,
    });

    if (test.intervenorContactId) {
      await test.runSequence('updateModalValueSequence', {
        key: `representingMap.${test.intervenorContactId}`,
        value: true,
      });
    }

    expect(
      test.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();

    await test.runSequence('associatePrivatePractitionerWithCaseSequence');

    expect(test.getState('caseDetail.privatePractitioners.length')).toEqual(1);
    expect(
      test.getState('caseDetail.privatePractitioners.0.representing'),
    ).toContain(contactPrimary.contactId);

    if (test.intervenorContactId) {
      expect(
        test.getState('caseDetail.privatePractitioners.0.representing'),
      ).toContain(test.intervenorContactId);
    }

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

    test.privatePractitioners = formatted.privatePractitioners[0];

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

      const contactSecondary = formattedCase.petitioners[1];
      await test.runSequence('updateModalValueSequence', {
        key: `representingMap.${contactSecondary.contactId}`,
        value: true,
      });

      await test.runSequence('associatePrivatePractitionerWithCaseSequence');
      expect(test.getState('caseDetail.privatePractitioners.length')).toEqual(
        2,
      );
      expect(
        test.getState('caseDetail.privatePractitioners.1.representing'),
      ).toEqual([contactSecondary.contactId]);
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

      await refreshElasticsearchIndex();
    }
  });
};
