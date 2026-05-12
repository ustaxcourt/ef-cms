jest.mock('../requests', () => ({
  get: jest.fn(),
}));

import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { get } from '../requests';
import { getDocketEntryProcessingStatusInteractor } from './getDocketEntryProcessingStatusProxy';

describe('getDocketEntryProcessingStatusInteractor', () => {
  beforeEach(() => {
    jest.mocked(get).mockResolvedValue({ processingStatus: 'pending' });
  });

  it('calls GET /case-documents/:docketNumber/:docketEntryId/processing-status', async () => {
    await getDocketEntryProcessingStatusInteractor(applicationContext, {
      docketEntryId: 'abc-123',
      docketNumber: '104-45',
    });

    expect(get).toHaveBeenCalledWith({
      applicationContext,
      endpoint: '/case-documents/104-45/abc-123/processing-status',
    });
  });
});
