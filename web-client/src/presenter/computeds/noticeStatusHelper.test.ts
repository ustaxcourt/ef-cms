import { noticeStatusHelper } from './noticeStatusHelper';
import { runCompute } from 'cerebral/test';

describe('orderTypesHelper', () => {
  it('should return all event codes for docketclerk', () => {
    const result = runCompute(noticeStatusHelper, {
      state: {
        noticeStatusState: {
          casesProcessed: 100,
          totalCases: 200,
        },
      } as Partial<State>,
    });
    expect(result.percentComplete).toEqual(50);
  });
});
