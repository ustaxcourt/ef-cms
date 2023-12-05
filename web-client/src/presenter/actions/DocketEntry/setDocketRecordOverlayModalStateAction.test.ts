import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocketRecordOverlayModalStateAction } from './setDocketRecordOverlayModalStateAction';

describe('setDocketRecordOverlayModalStateAction', () => {
  it('should set state.modal.docketEntry to the entry provided', async () => {
    const { state } = await runAction(setDocketRecordOverlayModalStateAction, {
      modules: {
        presenter,
      },
      props: {
        entry: MOCK_DOCUMENTS[0],
      },
      state: {},
    });

    expect(state.modal).toEqual({
      docketEntry: MOCK_DOCUMENTS[0],
    });
  });
});
