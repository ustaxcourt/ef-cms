import { runAction } from 'cerebral/test';
import { setDefaultDocketRecordSortAction } from './setDefaultDocketRecordSortAction';

describe('setDefaultDocketRecordSortAction', () => {
  it('should not default docketRecordSort if current caseId matches sessionMetadata caseId', async () => {
    const result = await runAction(setDefaultDocketRecordSortAction, {
      state: {
        caseDetail: { caseId: '123' },
        sessionMetadata: { docketRecordSort: { '123': 'something' } },
      },
    });

    expect(result.state.sessionMetadata.docketRecordSort['123']).toEqual(
      'something',
    );
  });

  it('should default docketRecordSort if current caseId does not match sessionMetadata caseId', async () => {
    const result = await runAction(setDefaultDocketRecordSortAction, {
      state: {
        caseDetail: { caseId: '987' },
        sessionMetadata: {},
      },
    });

    expect(result.state.sessionMetadata.docketRecordSort['987']).toEqual(
      'byDate',
    );
  });
});
