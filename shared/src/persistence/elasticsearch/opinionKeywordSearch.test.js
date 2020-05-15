const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { Document } = require('../../business/entities/Document');
const { opinionKeywordSearch } = require('./opinionKeywordSearch');

describe('opinionKeywordSearch', () => {
  const opinionEventCodes = Document.OPINION_DOCUMENT_TYPES;

  const baseQueryParams = [
    { match: { 'pk.S': 'case|' } },
    { match: { 'sk.S': 'document|' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    {
      bool: {
        should: [
          {
            match: {
              'eventCode.S': 'MOP',
            },
          },
          {
            match: {
              'eventCode.S': 'SOP',
            },
          },
          {
            match: {
              'eventCode.S': 'TCOP',
            },
          },
        ],
      },
    },
  ];

  it('does a bare search for just eventCodes', async () => {
    await opinionKeywordSearch({
      applicationContext,
      opinionEventCodes,
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.must,
    ).toEqual(baseQueryParams);
  });

  it('does a keyword search for opinions', async () => {
    await opinionKeywordSearch({
      applicationContext,
      opinionEventCodes,
      opinionKeyword: 'Guy Fieri',
    });

    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.must,
    ).toEqual([
      ...baseQueryParams,
      {
        simple_query_string: {
          fields: ['documentContents.S', 'documentTitle.S'],
          query: 'Guy Fieri',
        },
      },
    ]);
  });
});
