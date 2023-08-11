import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkAddsPractitionerToPrimaryContact = (
  cerebralTest,
  barNumber,
) => {
  return it('Petitions clerk manually adds multiple privatePractitioners to case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const beforePrivatePractitionersLength = cerebralTest.getState(
      'caseDetail.privatePractitioners',
    ).length;

    await cerebralTest.runSequence('openAddPrivatePractitionerModalSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'practitionerSearch',
      value: barNumber,
    });

    await cerebralTest.runSequence('openAddPrivatePractitionerModalSequence');

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

    await cerebralTest.runSequence(
      'associatePrivatePractitionerWithCaseSequence',
    );

    if (cerebralTest.intervenorContactId) {
      expect(
        cerebralTest.getState('caseDetail.privatePractitioners.0.representing'),
      ).toContain(cerebralTest.intervenorContactId);
    }

    let formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formatted.privatePractitioners.length).toEqual(
      beforePrivatePractitionersLength + 1,
    );
  });
};
