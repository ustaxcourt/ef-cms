import { messageDocumentHelper as messageDocumentHelperComputed } from '../../src/presenter/computeds/messageDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const messageDocumentHelper = withAppContextDecorator(
  messageDocumentHelperComputed,
);

export const petitionsClerk1ServesPetitionFromMessageDetail = cerebralTest => {
  return it('petitions clerk 1 serves paper-filed petition from message detail', async () => {
    let helper = runCompute(messageDocumentHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.showServePetitionButton).toBeTruthy();

    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
      redirectUrl: `/messages/${cerebralTest.docketNumber}/message-detail/${cerebralTest.parentMessageId}`,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PetitionQc');

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    await cerebralTest.runSequence('openConfirmServeToIrsModalSequence');

    await cerebralTest.runSequence('serveCaseToIrsSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'PrintPaperPetitionReceipt',
    );

    await cerebralTest.runSequence('completePrintPaperPetitionReceiptSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('MessageDetail');

    helper = runCompute(messageDocumentHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.showServePetitionButton).toBeFalsy();
  });
};
