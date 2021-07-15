import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkAddsPractitionersToCase = (
  cerebralTest,
  skipSecondary,
) => {
  return it('Petitions clerk manually adds multiple privatePractitioners to case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const practitionerBarNumber = cerebralTest.barNumber || 'PT1234';

    expect(cerebralTest.getState('caseDetail.privatePractitioners')).toEqual(
      [],
    );

    await cerebralTest.runSequence('openAddPrivatePractitionerModalSequence');

    expect(
      cerebralTest.getState('validationErrors.practitionerSearchError'),
    ).toBeDefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'practitionerSearch',
      value: practitionerBarNumber,
    });

    await cerebralTest.runSequence('openAddPrivatePractitionerModalSequence');

    expect(
      cerebralTest.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();
    expect(cerebralTest.getState('modal.practitionerMatches.length')).toEqual(
      1,
    );

    //default selected because there was only 1 match
    let practitionerMatch = cerebralTest.getState(
      'modal.practitionerMatches.0',
    );
    expect(cerebralTest.getState('modal.user.userId')).toEqual(
      practitionerMatch.userId,
    );

    const formattedCase = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });
    const contactPrimary = formattedCase.petitioners[0];

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: `representingMap.${contactPrimary.contactId}`,
      value: true,
    });

    if (cerebralTest.intervenorContactId) {
      await cerebralTest.runSequence('updateModalValueSequence', {
        key: `representingMap.${cerebralTest.intervenorContactId}`,
        value: true,
      });
    }

    expect(
      cerebralTest.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();

    await cerebralTest.runSequence(
      'associatePrivatePractitionerWithCaseSequence',
    );

    expect(
      cerebralTest.getState('caseDetail.privatePractitioners.length'),
    ).toEqual(1);
    expect(
      cerebralTest.getState('caseDetail.privatePractitioners.0.representing'),
    ).toContain(contactPrimary.contactId);

    if (cerebralTest.intervenorContactId) {
      expect(
        cerebralTest.getState('caseDetail.privatePractitioners.0.representing'),
      ).toContain(cerebralTest.intervenorContactId);
    }

    expect(
      cerebralTest.getState('caseDetail.privatePractitioners.0.name'),
    ).toEqual(practitionerMatch.name);

    let formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formatted.privatePractitioners.length).toEqual(1);
    expect(formatted.privatePractitioners[0].formattedName).toEqual(
      `${practitionerMatch.name} (${practitionerMatch.barNumber})`,
    );

    cerebralTest.privatePractitioners = formatted.privatePractitioners[0];

    //add a second practitioner
    if (!skipSecondary) {
      await cerebralTest.runSequence('updateFormValueSequence', {
        key: 'practitionerSearch',
        value: 'PT5432',
      });
      await cerebralTest.runSequence('openAddPrivatePractitionerModalSequence');

      expect(cerebralTest.getState('modal.practitionerMatches.length')).toEqual(
        1,
      );
      practitionerMatch = cerebralTest.getState('modal.practitionerMatches.0');
      expect(cerebralTest.getState('modal.user.userId')).toEqual(
        practitionerMatch.userId,
      );

      const contactSecondary = formattedCase.petitioners[1];
      await cerebralTest.runSequence('updateModalValueSequence', {
        key: `representingMap.${contactSecondary.contactId}`,
        value: true,
      });

      await cerebralTest.runSequence(
        'associatePrivatePractitionerWithCaseSequence',
      );
      expect(
        cerebralTest.getState('caseDetail.privatePractitioners.length'),
      ).toEqual(2);
      expect(
        cerebralTest.getState('caseDetail.privatePractitioners.1.representing'),
      ).toEqual([contactSecondary.contactId]);
      expect(
        cerebralTest.getState('caseDetail.privatePractitioners.1.name'),
      ).toEqual(practitionerMatch.name);

      formatted = runCompute(formattedCaseDetail, {
        state: cerebralTest.getState(),
      });

      expect(formatted.privatePractitioners.length).toEqual(2);
      expect(formatted.privatePractitioners[1].formattedName).toEqual(
        `${practitionerMatch.name} (${practitionerMatch.barNumber})`,
      );

      await refreshElasticsearchIndex();
    }
  });
};
