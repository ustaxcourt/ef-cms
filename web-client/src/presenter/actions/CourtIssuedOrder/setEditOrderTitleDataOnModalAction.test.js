import { ORDER_EVENT_CODES } from '../../../../../shared/src/business/entities/EntityConstants';
import { runAction } from 'cerebral/test';
import { setEditOrderTitleDataOnModalAction } from './setEditOrderTitleDataOnModalAction';

describe('setEditOrderTitleDataOnModalAction', () => {
  it('should set state.modal.eventCode from state.form.eventCode', async () => {
    const mockEventCode = ORDER_EVENT_CODES[0];

    const { state } = await runAction(setEditOrderTitleDataOnModalAction, {
      state: {
        form: {
          eventCode: mockEventCode,
        },
        modal: {
          eventCode: undefined,
        },
      },
    });

    expect(state.modal.eventCode).toEqual(mockEventCode);
  });

  it('should set state.modal.documentTitle from state.form.documentTitle', async () => {
    const mockDocumentTitle = "I don't feel like dancin'";

    const { state } = await runAction(setEditOrderTitleDataOnModalAction, {
      state: {
        form: {
          documentTitle: mockDocumentTitle,
        },
        modal: {
          documentTitle: undefined,
        },
      },
    });

    expect(state.modal.documentTitle).toEqual(mockDocumentTitle);
  });
});
