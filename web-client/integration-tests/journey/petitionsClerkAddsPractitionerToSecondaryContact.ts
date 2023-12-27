import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkAddsPractitionerToSecondaryContact = (
  cerebralTest,
  barNumber,
) => {
  return it('Petitions clerk adds a privatePractitioners to case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'practitionerSearch',
      value: barNumber,
    });

    await cerebralTest.runSequence('openAddPrivatePractitionerModalSequence');

    const formattedCase = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });
    const contactSecondary = formattedCase.petitioners[1];

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: `representingMap.${contactSecondary.contactId}`,
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
  });
};
