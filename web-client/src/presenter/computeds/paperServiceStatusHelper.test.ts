import { paperServiceStatusHelper } from './paperServiceStatusHelper';
import { runCompute } from 'cerebral/test';

describe('paperServiceStatusHelper', () => {
  it('should return all event codes for docketclerk', () => {
    const result = runCompute(paperServiceStatusHelper, {
      state: {
        paperServiceStatusState: {
          pdfsAppended: 100,
          totalPdfs: 200,
        },
      } as Partial<State>,
    });
    expect(result.percentComplete).toEqual(50);
  });
});
