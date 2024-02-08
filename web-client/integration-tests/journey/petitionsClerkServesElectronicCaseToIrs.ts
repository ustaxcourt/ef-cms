import { waitForLoadingComponentToHide, waitForModalsToHide } from '../helpers';

export const petitionsClerkServesElectronicCaseToIrs = cerebralTest => {
  return it(`Petitions clerk serves an electronically-filed case (${cerebralTest.docketNumber}) to IRS`, async () => {
    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    await cerebralTest.runSequence('openConfirmServeToIrsModalSequence');

    await cerebralTest.runSequence('serveCaseToIrsSequence');

    await waitForLoadingComponentToHide({ cerebralTest });
    await waitForModalsToHide({ cerebralTest, maxWait: 120000 });

    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
  });
};
