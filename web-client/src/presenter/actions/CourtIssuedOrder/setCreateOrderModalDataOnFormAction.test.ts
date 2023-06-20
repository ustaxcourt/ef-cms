import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCreateOrderModalDataOnFormAction } from './setCreateOrderModalDataOnFormAction';

describe('setCreateOrderModalDataOnFormAction', () => {
  it('sets decoded URI props values values into state.form when values are present', async () => {
    const result = await runAction(setCreateOrderModalDataOnFormAction, {
      modules: {
        presenter,
      },
      props: {
        documentTitle: 'Order to Do Something',
        documentType: 'Order',
        eventCode: 'O',
        parentMessageId: '9400ee05-40bd-41a0-afbe-4d18d3c85317',
      },
      state: {
        form: {
          richText: 'something',
        },
        modal: {},
      },
    });
    expect(result.state.form.eventCode).toEqual('O');
    expect(result.state.form.documentTitle).toEqual('Order to Do Something');
    expect(result.state.form.documentType).toEqual('Order');
    expect(result.state.form.richText).toEqual('something');
    expect(result.state.form.parentMessageId).toEqual(
      '9400ee05-40bd-41a0-afbe-4d18d3c85317',
    );
    expect(result.state.parentMessageId).toEqual(
      '9400ee05-40bd-41a0-afbe-4d18d3c85317',
    );
  });

  it('unstashes state.modal values into state.form when prop values are not are present', async () => {
    const result = await runAction(setCreateOrderModalDataOnFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          richText: 'something',
        },
        modal: {
          documentTitle: 'Order to Do Something',
          documentType: 'Order',
          eventCode: 'O',
          parentMessageId: '9400ee05-40bd-41a0-afbe-4d18d3c85317',
        },
      },
    });
    expect(result.state.form.eventCode).toEqual('O');
    expect(result.state.form.documentTitle).toEqual('Order to Do Something');
    expect(result.state.form.documentType).toEqual('Order');
    expect(result.state.form.richText).toEqual('something');
    expect(result.state.form.parentMessageId).toEqual(
      '9400ee05-40bd-41a0-afbe-4d18d3c85317',
    );
    expect(result.state.parentMessageId).toEqual(
      '9400ee05-40bd-41a0-afbe-4d18d3c85317',
    );
  });
});
