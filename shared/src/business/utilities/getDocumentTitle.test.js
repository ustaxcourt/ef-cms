const { getDocumentTitle } = require('./getDocumentTitle');
const { CATEGORY_MAP } = require('../entities/Document');
const { find } = require('lodash');

describe('getDocumentTitle returns correct titles', () => {
  it('for standard filing events', () => {
    const title = getDocumentTitle({
      filingEvent: {
        documentTitle: 'Some Document Title',
        scenario: 'Standard',
      },
    });
    expect(title).toEqual('Some Document Title');
  });

  it('for Nonstandard A', () => {
    const title = getDocumentTitle({
      filingEvent: {
        documentTitle: 'Some Document Title [placeholder]',
        scenario: 'Nonstandard A',
      },
      relatedInfo: {
        documentName: 'Kirk',
      },
    });
    expect(title).toEqual('Some Document Title Kirk');
  });

  it('for Nonstandard H', () => {
    const title = getDocumentTitle({
      filingEvent: {
        documentTitle: 'Some Document Title [placeholder]',
        scenario: 'Nonstandard H',
      },
      relatedInfo: {
        documentName: 'Spock',
      },
    });
    expect(title).toEqual('Some Document Title Spock');
  });
  it('for Nonstandard B', () => {
    const title = getDocumentTitle({
      filingEvent: {
        documentTitle: 'Some Document Title [placeholder]',
        scenario: 'Nonstandard B',
      },
      relatedInfo: {
        userText: 'Scotty',
      },
    });
    expect(title).toEqual('Some Document Title Scotty');
  });
  it('for Nonstandard E', () => {
    const title = getDocumentTitle({
      filingEvent: {
        documentTitle: 'Some Document Title [placeholder]',
        scenario: 'Nonstandard E',
      },
      relatedInfo: {
        userText: 'McCoy',
      },
    });
    expect(title).toEqual('Some Document Title McCoy');
  });
  it('for Nonstandard C', () => {
    const title = getDocumentTitle({
      filingEvent: {
        documentTitle: '[placeholder] Some Document Title [placeholder]',
        scenario: 'Nonstandard C',
      },
      relatedInfo: {
        documentName: 'Uhura',
        userText: 'Sulu',
      },
    });
    expect(title).toEqual('Sulu Some Document Title Uhura');
  });
  it('for Nonstandard D', () => {
    const title = getDocumentTitle({
      filingEvent: {
        documentTitle: '[placeholder] Some Document Title [placeholder]',
        scenario: 'Nonstandard D',
      },
      relatedInfo: {
        documentName: 'Chekov',
        userText: 'Christine Chapel',
      },
    });
    expect(title).toEqual('Chekov Some Document Title Christine Chapel');
  });
  it('for Nonstandard F', () => {
    const title = getDocumentTitle({
      filingEvent: {
        documentTitle: '[placeholder] Some Document Title [placeholder]',
        scenario: 'Nonstandard F',
      },
      relatedInfo: {
        documentName: 'Pike',
        ordinal: 'First',
      },
    });
    expect(title).toEqual('First Some Document Title Pike');
  });
  it('for Nonstandard G', () => {
    const title = getDocumentTitle({
      filingEvent: {
        documentTitle: '[placeholder] Some Document Title',
        scenario: 'Nonstandard G',
      },
      relatedInfo: {
        ordinal: '1701',
      },
    });
    expect(title).toEqual('1701 Some Document Title');
  });
  it('returns unchanged document title for an unrecognized filing event scenario', () => {
    const title = getDocumentTitle({
      filingEvent: {
        documentTitle: 'Some Document Title [placeholder]',
        scenario: 'Unrecognized',
      },
    });

    expect(title).toEqual('Some Document Title [placeholder]');
  });

  it('returns string with empty replacements if values are not provided', () => {
    const filingEvent = find(CATEGORY_MAP['Miscellaneous'], {
      eventCode: 'AMNT',
    });
    const title = getDocumentTitle({
      filingEvent,
      relatedInfo: {},
    });

    expect(title).toEqual(' Amendment to ');
  });
});
