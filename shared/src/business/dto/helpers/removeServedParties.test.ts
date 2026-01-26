import {
  MOCK_ANSWER_2,
  MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
} from '@shared/test/mockDocketEntry';
import { removeServedParties } from './removeServedParties';

describe('removeServedParties', () => {
  it('removes servedParties from docket entries and previous documents', () => {
    const mockDocketEntries: RawDocketEntry[] = [MOCK_ANSWER_2];
    const result = removeServedParties(mockDocketEntries);
    expect(result[0].servedParties).toBeUndefined();
  });
  it('removes servedParties from previousDocument if it exists', () => {
    const mockDocketEntries: RawDocketEntry[] = [
      MOCK_DOCKET_ENTRY_WITH_PREVIOUS_DOCUMENT,
    ];

    const result = removeServedParties(mockDocketEntries);
    expect(
      result[0].secondaryDocument?.previousDocument?.servedParties,
    ).toBeUndefined();
  });
});
