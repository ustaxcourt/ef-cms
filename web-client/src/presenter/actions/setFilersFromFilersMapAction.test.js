import { runAction } from 'cerebral/test';
import { setFilersFromFilersMapAction } from './setFilersFromFilersMapAction';

describe('setFilersFromFilersMapAction', () => {
  it('sets state.form.filers to contactIds from filersMap', async () => {
    const result = await runAction(setFilersFromFilersMapAction, {
      state: {
        form: {
          filersMap: {
            '28447d01-1722-4a68-a7e1-12b2987fe579': true,
            'a662c530-65da-437c-98c7-14939c9cfd00': false,
          },
        },
      },
    });

    expect(result.state.form.filers).toEqual([
      '28447d01-1722-4a68-a7e1-12b2987fe579',
    ]);
  });

  it('sets state.form.filedBy to the filers array when state.form.filersMap is empty', async () => {
    const result = await runAction(setFilersFromFilersMapAction, {
      state: {
        form: {
          filedBy: 'A legacy user',
          filersMap: {},
        },
      },
    });

    expect(result.state.form.filers).toEqual(['A legacy user']);
  });
});
