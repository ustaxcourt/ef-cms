import { runAction } from '@web-client/presenter/test.cerebral';
import { setContactInformationForModalAction } from './setContactInformationForModalAction';

describe('setContactInformationForModalAction', () => {
  it('should set the state.contactToSeal to the value of props.contactToSeal', async () => {
    const { state } = await runAction(setContactInformationForModalAction, {
      props: {
        contactToSeal: {
          contactId: '123',
          name: 'Spouse 1',
        },
      },
      state: {},
    });

    expect(state.contactToSeal).toEqual({
      contactId: '123',
      name: 'Spouse 1',
    });
  });
});
