const { getDescriptionDisplay } = require('./getDescriptionDisplay');

describe('getDescriptionDisplay', () => {
  const documentTitle = 'doc title';
  const documentType = 'doc type';
  const description = 'doc description';

  let documentMetaData = {
    documentTitle,
  };

  it('returns descriptionDisplay as documentTitle with no added information', () => {
    const expected = documentTitle;
    const result = getDescriptionDisplay(documentMetaData);

    expect(result).toEqual(expected);
  });

  it('returns descriptionDisplay as documentType with no added information', () => {
    const expected = 'doc type';
    documentMetaData = {
      ...documentMetaData,
      documentTitle: undefined,
      documentType,
    };
    const result = getDescriptionDisplay(documentMetaData);

    expect(result).toEqual(expected);
  });

  it('returns descriptionDisplay as description with no added information', () => {
    const expected = 'doc description';
    documentMetaData = {
      ...documentMetaData,
      description,
      documentTitle: undefined,
      documentType: undefined,
    };
    const result = getDescriptionDisplay(documentMetaData);

    expect(result).toEqual(expected);
  });

  it('returns descriptionDisplay as document title plus additionalInfo if addToCoversheet is true', () => {
    const expected = 'doc title superfulous text';
    documentMetaData = {
      ...documentMetaData,
      addToCoversheet: true,
      additionalInfo: 'superfulous text',
      documentTitle,
    };
    const result = getDescriptionDisplay(documentMetaData);

    expect(result).toEqual(expected);
  });

  it('returns descriptionDisplay as document title plus additionalInfo if addAdditionalInfoOverride is true', () => {
    const expected = 'doc title superfulous text';
    documentMetaData = {
      ...documentMetaData,
      addToCoversheet: undefined,
      additionalInfo: 'superfulous text',
      documentTitle,
    };

    const addAdditionalInfoOverride = true;
    const result = getDescriptionDisplay(
      documentMetaData,
      addAdditionalInfoOverride,
    );

    expect(result).toEqual(expected);
  });

  it('returns descriptionDisplay as document title with no additionalInfo if addToCoversheet is false', () => {
    const expected = 'doc title';
    documentMetaData = {
      ...documentMetaData,
      addToCoversheet: false,
      additionalInfo: 'superfulous text',
      documentTitle,
    };
    const result = getDescriptionDisplay(documentMetaData);

    expect(result).toEqual(expected);
  });

  it('returns descriptionDisplay as freeText and documentTitle if eventCode is OCS and freeText is available', () => {
    const expected = 'free text - doc title';
    documentMetaData = {
      ...documentMetaData,
      addToCoversheet: false,
      additionalInfo: 'superfulous text',
      documentTitle,
      eventCode: 'OCS',
      freeText: 'free text',
    };
    const result = getDescriptionDisplay(documentMetaData);

    expect(result).toEqual(expected);
  });
});
