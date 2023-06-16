import { runAction } from '@web-client/presenter/test.cerebral';
import { toggleMobileDocketSortAction } from './toggleMobileDocketSortAction';

describe('toggleMobileDocketSortAction', () => {
  it('should set sessionMetadata.docketRecordSort to byDateDesc if it is currently byDate', async () => {
    const result = await runAction(toggleMobileDocketSortAction, {
      state: {
        caseDetail: { docketNumber: '987-65' },
        sessionMetadata: { docketRecordSort: { '987-65': 'byDate' } },
      },
    });

    expect(result.state.sessionMetadata.docketRecordSort['987-65']).toEqual(
      'byDateDesc',
    );
  });

  it('should set sessionMetadata.docketRecordSort to byDate if it is currently byDateDesc', async () => {
    const result = await runAction(toggleMobileDocketSortAction, {
      state: {
        caseDetail: { docketNumber: '987-65' },
        sessionMetadata: { docketRecordSort: { '987-65': 'byDateDesc' } },
      },
    });

    expect(result.state.sessionMetadata.docketRecordSort['987-65']).toEqual(
      'byDate',
    );
  });
});
