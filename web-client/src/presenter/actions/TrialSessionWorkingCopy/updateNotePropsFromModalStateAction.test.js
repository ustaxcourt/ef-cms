import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateNotePropsFromModalStateAction } from './updateNotePropsFromModalStateAction';

describe('updateNotePropsFromModalStateAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(updateNotePropsFromModalStateAction, {
      modules: {
        presenter,
      },
      props: {},
      state: { modal: { docketNumber: '123', notes: 'down with opp' } },
    });

    expect(result.output).toEqual({
      docketNumber: '123',
      notes: 'down with opp',
    });
  });
});
