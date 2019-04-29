import { documentHelper } from './documentHelper';
import { runCompute } from 'cerebral/test';

describe('documentHelper', () => {
  it('should return a correctly-assembled URI to document details based on docket number and document id', async () => {
    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
    });
    expect(result).toEqual('/case-detail/abc/documents/123');
  });

  it('should return a correctly-assembled URI to document details based on docket number, document id, and messageId', async () => {
    const result = await runCompute(documentHelper)({
      docketNumber: 'abc',
      documentId: '123',
      messageId: '123',
    });
    expect(result).toEqual('/case-detail/abc/documents/123/messages/123');
  });
});
