import { getDescriptionDisplay } from './getDescriptionDisplay';

describe('getDescriptionDisplay', () => {
  const documentTitle = 'doc title';
  const documentType = 'doc type';
  const description = 'doc description';

  let baseDocketEntry = {
    documentTitle,
  };

  it('returns descriptionDisplay as documentTitle with no added information', () => {
    const result = getDescriptionDisplay(baseDocketEntry);
    expect(result).toEqual('doc title');
  });

  it('returns descriptionDisplay as documentType with no added information', () => {
    baseDocketEntry = {
      ...baseDocketEntry,
      documentTitle: undefined,
      documentType,
    };
    const result = getDescriptionDisplay(baseDocketEntry);

    expect(result).toEqual('doc type');
  });

  it('returns descriptionDisplay as description with no added information', () => {
    baseDocketEntry = {
      ...baseDocketEntry,
      description,
      documentTitle: undefined,
      documentType: undefined,
    };
    const result = getDescriptionDisplay(baseDocketEntry);
    expect(result).toEqual('doc description');
  });

  it('should return descriptionDisplay as document title plus additionalInfo', () => {
    baseDocketEntry = {
      ...baseDocketEntry,
      additionalInfo: 'superfulous text',
      documentTitle,
    };
    const result = getDescriptionDisplay(baseDocketEntry);
    expect(result).toEqual('doc title superfulous text');
  });

  it('returns descriptionDisplay as freeText and documentTitle if eventCode is OCS and freeText is available', () => {
    baseDocketEntry = {
      ...baseDocketEntry,
      addToCoversheet: false,
      documentTitle,
      eventCode: 'OCS',
      freeText: 'free text',
    };
    const result = getDescriptionDisplay(baseDocketEntry);

    expect(result).toEqual('free text - doc title');
  });
});
