const { getDescriptionDisplay } = require('./getDescriptionDisplay');

describe('getDescriptionDisplay', () => {
  const documentTitle = 'doc title';
  let documentMetaData = {
    documentTitle,
  };

  it('returns the document title with no added information if there is no previous document available', () => {
    const result = getDescriptionDisplay(documentMetaData);

    expect(result).toEqual(result);
  });

  it('returns the originally created document title from previous document if additional info is not provided', () => {
    documentMetaData = {
      ...documentMetaData,
      previousDocument: {
        additionalInfo: 'superfulous text',
        documentTitle: 'Motion for Summary Judgement',
      },
    };

    const result = getDescriptionDisplay(documentMetaData);
    const expected = 'Motion for Summary Judgement superfulous text';
    expect(result).toEqual(expected);
  });

  it('returns a newly created document title using previous document title, additionalInfo and newly added the newly added info', () => {
    documentMetaData = {
      ...documentMetaData,
      additionalInfo: 'newly added info',
      previousDocument: {
        additionalInfo: 'superfulous text',
        documentTitle: 'Motion for Summary Judgement',
      },
    };

    const result = getDescriptionDisplay(documentMetaData);
    const expected =
      'Motion for Summary Judgement superfulous text newly added info';
    expect(result).toEqual(expected);
  });
});
