import { CourtIssuedDocumentFactory } from './CourtIssuedDocumentFactory';
import { CourtIssuedDocumentPartial } from './CourtIssuedDocumentPartial';
import { CourtIssuedDocumentTypeI } from './CourtIssuedDocumentTypeI';

describe('CourtIssuedDocumentFactory', () => {
  it('should return a CourtIssuedDocumentPartial when no scenario is provided', () => {
    expect(CourtIssuedDocumentFactory({})).toBeInstanceOf(
      CourtIssuedDocumentPartial,
    );
  });

  it('should return a CourtIssuedDocumentPartial when the scenario is not recognized', () => {
    expect(CourtIssuedDocumentFactory({ scenario: 'Type Z' })).toBeInstanceOf(
      CourtIssuedDocumentPartial,
    );
  });

  it('should match the scenario case-insensitively and ignore surrounding whitespace', () => {
    expect(
      CourtIssuedDocumentFactory({ scenario: '  TYPE I  ' }),
    ).toBeInstanceOf(CourtIssuedDocumentTypeI);
  });
});
