import { runAction } from 'cerebral/test';
import { setFilersFromFilersMapForModalAction } from './setFilersFromFilersMapForModalAction';

describe('setFilersFromFilersMapForModalAction', () => {
  const mockContactIdChecked = '28447d01-1722-4a68-a7e1-12b2987fe579';
  const mockContactIdUnchecked = 'a662c530-65da-437c-98c7-14939c9cfd00';

  it('sets state.modal.filers to contactIds from filersMap', async () => {
    const result = await runAction(setFilersFromFilersMapForModalAction, {
      state: {
        modal: {
          filersMap: {
            [mockContactIdChecked]: true,
            [mockContactIdUnchecked]: false,
          },
        },
      },
    });

    expect(result.state.modal.filers).toEqual([mockContactIdChecked]);
  });
});
