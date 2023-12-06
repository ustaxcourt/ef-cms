import { GENERIC_ORDER_EVENT_CODE } from '../../../../../shared/src/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setEditOrderTitleDataOnModalAction } from './setEditOrderTitleDataOnModalAction';

describe('setEditOrderTitleDataOnModalAction', () => {
  it('should set state.modal.eventCode from state.form.eventCode', async () => {
    const mockEventCode = GENERIC_ORDER_EVENT_CODE;

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

  it('should set state.modal.documentType from state.form.documentType', async () => {
    const mockDocumentType = 'I wanna dance with somebody';

    const { state } = await runAction(setEditOrderTitleDataOnModalAction, {
      state: {
        form: {
          documentType: mockDocumentType,
        },
        modal: {
          documentType: undefined,
        },
      },
    });

    expect(state.modal.documentType).toEqual(mockDocumentType);
  });
});
