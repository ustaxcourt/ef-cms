import { getDocumentTitleWithAdditionalInfo } from './getDocumentTitleWithAdditionalInfo';

describe('getDocumentTitleWithAdditionalInfo', () => {
  it('returns the original documentTitle when addToCoversheet is false', () => {
    const docketEntry = {
      addToCoversheet: false,
      additionalInfo: 'some additional info',
      documentTitle: 'Answer',
    };

    const generatedDocumentTitle = getDocumentTitleWithAdditionalInfo({
      docketEntry,
    });

    expect(generatedDocumentTitle).toEqual(docketEntry.documentTitle);
  });

  it('returns the documentTitle with additionalInfo when addToCoversheet is true', () => {
    const docketEntry = {
      addToCoversheet: true,
      additionalInfo: 'some additional info',
      documentTitle: 'Answer',
    };

    const generatedDocumentTitle = getDocumentTitleWithAdditionalInfo({
      docketEntry,
    });

    expect(generatedDocumentTitle).toEqual(
      `${docketEntry.documentTitle} ${docketEntry.additionalInfo}`,
    );
  });

  it('returns the original documentTitle when addToCoversheet is true but additionalInfo is undefined', () => {
    const docketEntry = {
      addToCoversheet: true,
      documentTitle: 'Answer',
    };

    const generatedDocumentTitle = getDocumentTitleWithAdditionalInfo({
      docketEntry,
    });

    expect(generatedDocumentTitle).toEqual(docketEntry.documentTitle);
  });
});
