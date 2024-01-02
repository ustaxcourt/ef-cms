import { MOCK_DOCUMENTS } from '../../../../../shared/src/test/mockDocketEntry';
import { marshallDocketEntry } from './marshallDocketEntry';
const MOCK_DOCUMENT = MOCK_DOCUMENTS[0];

describe('marshallDocketEntry', () => {
  const mock = Object.assign({}, MOCK_DOCUMENT, {
    servedAt: '2018-12-21T20:49:28.192Z',
  });

  it('returns a docketEntry object with the expected properties', () => {
    expect(Object.keys(marshallDocketEntry(mock)).sort()).toEqual([
      'docketEntryId',
      'docketNumber',
      'documentTitle',
      'eventCode',
      'eventCodeDescription',
      'filedBy',
      'filingDate',
      'index',
      'isFileAttached',
      'servedAt',
    ]);
  });

  it('marshalls from the current docketEntry format', () => {
    expect(mock.docketEntryId).toBeDefined();
    expect(mock.docketNumber).toBeDefined();
    expect(mock.documentType).toBeDefined();
    expect(mock.documentTitle).toBeDefined();
    expect(mock.eventCode).toBeDefined();
    expect(mock.filedBy).toBeDefined();
    expect(mock.filingDate).toBeDefined();
    expect(mock.index).toBeDefined();
    expect(mock.isFileAttached).toBeDefined();
    expect(mock.servedAt).toBeDefined();

    const marshalled = marshallDocketEntry(mock);

    expect(marshalled.docketEntryId).toEqual(mock.docketEntryId);
    expect(marshalled.docketNumber).toEqual(mock.docketNumber);
    expect(marshalled.documentTitle).toEqual(mock.documentTitle);
    expect(marshalled.eventCode).toEqual(mock.eventCode);
    expect(marshalled.eventCodeDescription).toEqual(mock.documentType);
    expect(marshalled.filedBy).toEqual(mock.filedBy);
    expect(marshalled.filingDate).toEqual(mock.filingDate);
    expect(marshalled.index).toEqual(mock.index);
    expect(marshalled.isFileAttached).toEqual(mock.isFileAttached);
    expect(marshalled.servedAt).toEqual(mock.servedAt);
  });

  it('sets a default value for isFileAttached if it is not specified', () => {
    expect(
      marshallDocketEntry({ ...mock, isFileAttached: undefined })
        .isFileAttached,
    ).toBe(false);
  });
});
