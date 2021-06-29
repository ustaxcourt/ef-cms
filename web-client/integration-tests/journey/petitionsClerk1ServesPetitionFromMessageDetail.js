import { messageDocumentHelper as messageDocumentHelperComputed } from '../../src/presenter/computeds/messageDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const messageDocumentHelper = withAppContextDecorator(
  messageDocumentHelperComputed,
);

export const petitionsClerk1ServesPetitionFromMessageDetail = test => {
  return it('petitions clerk 1 serves paper-filed petition from message detail', async () => {
    let helper = runCompute(messageDocumentHelper, {
      state: test.getState(),
    });

    expect(helper.showServePetitionButton).toBeTruthy();

    await test.runSequence('gotoPetitionQcSequence', {
      docketNumber: test.docketNumber,
      redirectUrl: `/messages/${test.docketNumber}/message-detail/${test.parentMessageId}`,
    });

    expect(test.getState('currentPage')).toEqual('PetitionQc');

    await test.runSequence('saveSavedCaseForLaterSequence');

    expect(test.getState('currentPage')).toEqual('ReviewSavedPetition');

    await test.runSequence('openConfirmServeToIrsModalSequence');

    await test.runSequence('serveCaseToIrsSequence');

    expect(test.getState('currentPage')).toEqual('PrintPaperPetitionReceipt');

    await test.runSequence('completePrintPaperPetitionReceiptSequence');

    expect(test.getState('currentPage')).toEqual('MessageDetail');

    helper = runCompute(messageDocumentHelper, {
      state: test.getState(),
    });

    expect(helper.showServePetitionButton).toBeFalsy();
  });
};
