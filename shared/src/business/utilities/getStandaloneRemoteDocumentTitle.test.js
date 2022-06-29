import { getStandaloneRemoteDocumentTitle } from './getStandaloneRemoteDocumentTitle';

describe('getStandaloneRemoteDocumentTitle', () => {
  it('should replace "at [Place]" in title with "in standalone remote session"', () => {
    const result = getStandaloneRemoteDocumentTitle({
      documentTitle: 'Further Trial before [Judge] at [Place]',
    });

    expect(result).toEqual(
      'Further Trial before [Judge] in standalone remote session',
    );
  });
});
