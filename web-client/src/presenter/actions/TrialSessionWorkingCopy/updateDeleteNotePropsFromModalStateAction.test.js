import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateDeleteNotePropsFromModalStateAction } from './updateDeleteNotePropsFromModalStateAction';

describe('updateDeleteNotePropsFromModalStateAction', () => {
  it('should set the modal docketNumber state', async () => {
    const result = await runAction(updateDeleteNotePropsFromModalStateAction, {
      modules: {
        presenter,
      },
      props: {},
      state: { modal: { docketNumber: '123' } },
    });

    expect(result.output).toEqual({
      docketNumber: '123',
    });
  });
});
