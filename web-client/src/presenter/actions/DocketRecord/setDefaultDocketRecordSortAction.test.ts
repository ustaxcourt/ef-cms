import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultDocketRecordSortAction } from './setDefaultDocketRecordSortAction';

describe('setDefaultDocketRecordSortAction', () => {
  it('should not default docketRecordSort if current docketNumber matches sessionMetadata docketNumber', async () => {
    const result = await runAction(setDefaultDocketRecordSortAction, {
      state: {
        caseDetail: { docketNumber: '123-45' },
        sessionMetadata: { docketRecordSort: { '123-45': 'something' } },
      },
    });

    expect(result.state.sessionMetadata.docketRecordSort['123-45']).toEqual(
      'something',
    );
  });

  it('should default docketRecordSort if current docketNumber does not match sessionMetadata docketNumber', async () => {
    const result = await runAction(setDefaultDocketRecordSortAction, {
      state: {
        caseDetail: { docketNumber: '987-65' },
        sessionMetadata: {},
      },
    });

    expect(result.state.sessionMetadata.docketRecordSort['987-65']).toEqual(
      'byDate',
    );
  });
});
