import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateCreateOrderModalFormValueAction } from './updateCreateOrderModalFormValueAction';

presenter.providers.applicationContext = applicationContextForClient;

describe('updateCreateOrderModalFormValueAction', () => {
  it('sets state.modal values correctly if valid event code is passed in', async () => {
    const result = await runAction(updateCreateOrderModalFormValueAction, {
      modules: {
        presenter,
      },
      props: { key: 'eventCode', value: 'ODD' },
      state: {
        modal: {},
      },
    });
    expect(result.state.modal.eventCode).toEqual('ODD');
    expect(result.state.modal.documentTitle).toEqual(
      'Order of Dismissal and Decision',
    );
    expect(result.state.modal.documentType).toEqual(
      'Order of Dismissal and Decision',
    );
  });

  it('sets state.modal values correctly if a generic order event code is passed in', async () => {
    const result = await runAction(updateCreateOrderModalFormValueAction, {
      modules: {
        presenter,
      },
      props: { key: 'eventCode', value: 'O' },
      state: {
        modal: {},
      },
    });
    expect(result.state.modal.eventCode).toEqual('O');
    expect(result.state.modal.documentTitle).toEqual('Order');
    expect(result.state.modal.documentType).toEqual('Order');
  });

  it('sets state.modal values correctly if a generic notice event code is passed in', async () => {
    const result = await runAction(updateCreateOrderModalFormValueAction, {
      modules: {
        presenter,
      },
      props: { key: 'eventCode', value: 'NOT' },
      state: {
        modal: {},
      },
    });
    expect(result.state.modal.eventCode).toEqual('NOT');
    expect(result.state.modal.documentTitle).toEqual('Notice');
    expect(result.state.modal.documentType).toEqual('Notice');
  });

  it('unsets state.modal values if event code is empty', async () => {
    const params = {
      modules: {
        presenter,
      },
      props: { key: 'eventCode', value: '' },
      state: {
        modal: {
          documentTitle: 'Order of Dismissal and Decision',
          documentType: 'Order of Dismissal and Decision',
          eventCode: 'ODD',
        },
      },
    };
    let result = await runAction(updateCreateOrderModalFormValueAction, params);
    expect(result.state.modal.eventCode).toBeUndefined();
    expect(result.state.modal.documentTitle).toBeUndefined();
    expect(result.state.modal.documentType).toBeUndefined();

    params.props.value = undefined;
    result = await runAction(updateCreateOrderModalFormValueAction, params);
    expect(result.state.modal.eventCode).toBeUndefined();
    expect(result.state.modal.documentTitle).toBeUndefined();
    expect(result.state.modal.documentType).toBeUndefined();

    params.props = {};
    result = await runAction(updateCreateOrderModalFormValueAction, params);
    expect(result.state.modal.eventCode).toBeUndefined();
    expect(result.state.modal.documentTitle).toBeUndefined();
    expect(result.state.modal.documentType).toBeUndefined();
  });

  it('sets documentTitle if documentTitle is passed in via props', async () => {
    const params = {
      modules: {
        presenter,
      },
      props: { key: 'documentTitle', value: 'Order to Do Something' },
      state: {
        modal: {
          documentType: 'Order',
          eventCode: 'O',
        },
      },
    };
    let result = await runAction(updateCreateOrderModalFormValueAction, params);
    expect(result.state.modal.documentTitle).toEqual('Order to Do Something');
  });

  it('unsets documentTitle if documentTitle passed in via props is empty', async () => {
    const params = {
      modules: {
        presenter,
      },
      props: { key: 'documentTitle', value: '' },
      state: {
        modal: {
          documentTitle: 'Order to Do Something',
          documentType: 'Order',
          eventCode: 'O',
        },
      },
    };
    let result = await runAction(updateCreateOrderModalFormValueAction, params);
    expect(result.state.modal.documentTitle).toBeUndefined();
  });

  it('sets documentTitle to Order if new eventCode passed in is a generic order', async () => {
    const params = {
      modules: {
        presenter,
      },
      props: { key: 'eventCode', value: 'O' },
      state: {
        modal: {
          documentTitle: 'Order of Dismissal and Decision',
          documentType: 'Order of Dismissal and Decision',
          eventCode: 'ODD',
        },
      },
    };
    let result = await runAction(updateCreateOrderModalFormValueAction, params);
    expect(result.state.modal.documentTitle).toEqual('Order');
    expect(result.state.modal.documentType).toEqual('Order');
  });
});
