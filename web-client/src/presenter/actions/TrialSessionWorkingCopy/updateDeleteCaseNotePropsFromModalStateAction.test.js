import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateDeleteCaseNotePropsFromModalStateAction } from './updateDeleteCaseNotePropsFromModalStateAction';

describe('updateDeleteCaseNotePropsFromModalStateAction', () => {
  it('should set the modal docketNumber state', async () => {
    const result = await runAction(updateDeleteCaseNotePropsFromModalStateAction, {
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
