import { getDescriptionDisplay } from './getDescriptionDisplay';

describe('getDescriptionDisplay', () => {
  const documentTitle = 'doc title';
  const documentType = 'doc type';
  const description = 'doc description';

  let documentMetaData = {
    documentTitle,
  };

  it('returns descriptionDisplay as documentTitle with no added information', () => {
    const result = getDescriptionDisplay(documentMetaData);
    expect(result).toEqual('doc title');
  });

  it('returns descriptionDisplay as documentType with no added information', () => {
    documentMetaData = {
      ...documentMetaData,
      documentTitle: undefined,
      documentType,
    };
    const result = getDescriptionDisplay(documentMetaData);

    expect(result).toEqual('doc type');
  });

  it('returns descriptionDisplay as description with no added information', () => {
    documentMetaData = {
      ...documentMetaData,
      description,
      documentTitle: undefined,
      documentType: undefined,
    };
    const result = getDescriptionDisplay(documentMetaData);
    expect(result).toEqual('doc description');
  });

  it('returns descriptionDisplay as document title plus additionalInfo if addToCoversheet is true', () => {
    documentMetaData = {
      ...documentMetaData,
      addToCoversheet: true,
      additionalInfo: 'superfulous text',
      documentTitle,
    };
    const result = getDescriptionDisplay(documentMetaData);
    expect(result).toEqual('doc title superfulous text');
  });

  it('returns descriptionDisplay as document title with no additionalInfo if addToCoversheet is false', () => {
    documentMetaData = {
      ...documentMetaData,
      addToCoversheet: false,
      additionalInfo: 'superfulous text',
      documentTitle,
    };
    const result = getDescriptionDisplay(documentMetaData);

    expect(result).toEqual('doc title');
  });

  it('returns descriptionDisplay as freeText and documentTitle if eventCode is OCS and freeText is available', () => {
    documentMetaData = {
      ...documentMetaData,
      addToCoversheet: false,
      additionalInfo: 'superfulous text',
      documentTitle,
      eventCode: 'OCS',
      freeText: 'free text',
    };
    const result = getDescriptionDisplay(documentMetaData);

    expect(result).toEqual('free text - doc title');
  });
});
