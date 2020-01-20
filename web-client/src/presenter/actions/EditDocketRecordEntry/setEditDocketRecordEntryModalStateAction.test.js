import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setEditDocketRecordEntryModalStateAction } from './setEditDocketRecordEntryModalStateAction';

describe('setEditDocketRecordEntryModalStateAction', () => {
  it('should update the state from state', async () => {
    const result = await runAction(setEditDocketRecordEntryModalStateAction, {
      modules: { presenter },
      props: { index: 1 },
      state: {
        caseDetail: {
          caseId: '123',
          docketRecord: [{ description: 'something', index: 1 }],
        },
      },
    });

    expect(result.state.modal.form).toEqual({
      description: 'something',
      index: 1,
    });
    expect(result.state.modal.caseId).toEqual('123');
    expect(result.state.modal.docketRecordIndex).toEqual(1);
  });
});
