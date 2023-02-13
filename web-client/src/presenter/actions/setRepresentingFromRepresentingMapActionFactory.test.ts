import { runAction } from 'cerebral/test';
import { setRepresentingFromRepresentingMapActionFactory } from './setRepresentingFromRepresentingMapActionFactory';

describe('setRepresentingFromRepresentingMapActionFactory', () => {
  const mockContactIdChecked = '28447d01-1722-4a68-a7e1-12b2987fe579';
  const mockContactIdUnchecked = 'a662c530-65da-437c-98c7-14939c9cfd00';

  it('sets state.modal.representing to contactIds from representingMap when modal is passed in', async () => {
    const result = await runAction(
      setRepresentingFromRepresentingMapActionFactory('modal'),
      {
        state: {
          modal: {
            representingMap: {
              [mockContactIdChecked]: true,
              [mockContactIdUnchecked]: false,
            },
          },
        },
      },
    );

    expect(result.state.modal.representing).toEqual([mockContactIdChecked]);
  });

  it('sets state.form.representing to contactIds from representingMap when form is passed in', async () => {
    const result = await runAction(
      setRepresentingFromRepresentingMapActionFactory('form'),
      {
        state: {
          form: {
            representingMap: {
              [mockContactIdChecked]: true,
              [mockContactIdUnchecked]: false,
            },
          },
        },
      },
    );

    expect(result.state.form.representing).toEqual([mockContactIdChecked]);
  });
});
