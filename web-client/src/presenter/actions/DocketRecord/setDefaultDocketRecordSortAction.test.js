import { runAction } from 'cerebral/test';
import { setDefaultDocketRecordSortAction } from './setDefaultDocketRecordSortAction';

describe('setDefaultDocketRecordSortAction', () => {
  it('should not default docketRecordSort if current caseId matches sessionMetadata caseId', async () => {
    const result = await runAction(setDefaultDocketRecordSortAction, {
      state: {
        caseDetail: { caseId: '123' },
        sessionMetadata: { caseId: '123', docketRecordSort: 'something' },
      },
    });

    expect(result.state.sessionMetadata.docketRecordSort).toEqual('something');
  });

  it('should default docketRecordSort if current caseId does not match sessionMetadata caseId', async () => {
    const result = await runAction(setDefaultDocketRecordSortAction, {
      state: {
        caseDetail: { caseId: '987' },
        sessionMetadata: { caseId: '123', docketRecordSort: 'something' },
      },
    });

    expect(result.state.sessionMetadata.docketRecordSort).toEqual('byDate');
  });
});
