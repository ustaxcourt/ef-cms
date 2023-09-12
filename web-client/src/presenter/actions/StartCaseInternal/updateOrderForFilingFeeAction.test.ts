import { PAYMENT_STATUS } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateOrderForFilingFeeAction } from './updateOrderForFilingFeeAction';

describe('updateOrderForFilingFeeAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.form.orderForFilingFee true if props.key is petitionPaymentStatus and props.value is Unpaid', async () => {
    const result = await runAction(updateOrderForFilingFeeAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'petitionPaymentStatus',
        value: PAYMENT_STATUS.UNPAID,
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form.orderForFilingFee).toEqual(true);
  });

  it('should not modify state.form.orderForFilingFee if props.key is not petitionPaymentStatus', async () => {
    const result = await runAction(updateOrderForFilingFeeAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'anotherField',
        value: PAYMENT_STATUS.UNPAID,
      },
      state: {
        form: {
          orderForFilingFee: 'woah',
        },
      },
    });

    expect(result.state.form.orderForFilingFee).toEqual('woah');
  });

  it('should set state.form.orderForFilingFee false if props.key is petitionPaymentStatus and props.value is not Unpaid', async () => {
    const result = await runAction(updateOrderForFilingFeeAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'petitionPaymentStatus',
        value: PAYMENT_STATUS.PAID,
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form.orderForFilingFee).toEqual(false);
  });
});
