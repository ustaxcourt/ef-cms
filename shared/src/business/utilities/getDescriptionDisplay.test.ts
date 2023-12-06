import { getDescriptionDisplay } from './getDescriptionDisplay';

describe('getDescriptionDisplay', () => {
  const documentTitle = 'doc title';
  const documentType = 'doc type';
  const description = 'doc description';
  let baseDocketEntry;

  beforeEach(() => {
    baseDocketEntry = {
      documentTitle,
    };
  });

  it('should return descriptionDisplay as documentTitle with no added information', () => {
    const result = getDescriptionDisplay(baseDocketEntry);
    expect(result).toEqual('doc title');
  });

  it('should return descriptionDisplay as documentType with no added information', () => {
    baseDocketEntry = {
      ...baseDocketEntry,
      documentTitle: undefined,
      documentType,
    };
    const result = getDescriptionDisplay(baseDocketEntry);

    expect(result).toEqual('doc type');
  });

  it('should return descriptionDisplay as description with no added information', () => {
    baseDocketEntry = {
      ...baseDocketEntry,
      description,
      documentTitle: undefined,
      documentType: undefined,
    };
    const result = getDescriptionDisplay(baseDocketEntry);
    expect(result).toEqual('doc description');
  });

  it('should return descriptionDisplay as document title plus additionalInfo, filingsAndProceedings, and additionalInfo2', () => {
    baseDocketEntry = {
      ...baseDocketEntry,
      additionalInfo: 'superfulous text',
      additionalInfo2: 'additional info 2!',
      documentTitle,
      filingsAndProceedings: '(Attachment(s))',
    };
    const result = getDescriptionDisplay(baseDocketEntry);
    expect(result).toEqual(
      'doc title superfulous text (Attachment(s)) additional info 2!',
    );
  });

  it('should return descriptionDisplay as freeText and documentTitle if eventCode is OCS and freeText is available', () => {
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
