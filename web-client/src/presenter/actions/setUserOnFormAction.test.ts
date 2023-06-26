import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setUserOnFormAction } from './setUserOnFormAction';

describe('setUserOnFormAction', () => {
  it('sets editable user fields from props.user on state.form', async () => {
    const result = await runAction(setUserOnFormAction, {
      modules: {
        presenter,
      },
      props: {
        user: {
          barNumber: 'TU1234',
          contact: {
            address1: '123 Main St',
          },
          firmName: 'testing',
          name: 'Test User',
          userId: '123',
        },
      },
      state: {},
    });
    expect(result.state.form).toEqual({
      barNumber: 'TU1234',
      contact: {
        address1: '123 Main St',
      },
      firmName: 'testing',
      name: 'Test User',
    });
  });
});
