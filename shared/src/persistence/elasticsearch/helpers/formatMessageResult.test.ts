import { formatMessageResult } from './formatMessageResult';

describe('formatMessageResult', () => {
  const mockMessageResult = {
    _id: 'case|312-21_case|312-21',
    _index: 'efcms-message',
    _score: 3.0612311,
    _source: {
      messageId: 'd4b87b69-e3d6-44b6-a3fe-6290ff177d6f',
    },
    _type: '_doc',
    inner_hits: {
      'case-mappings': {
        hits: {
          hits: [
            {
              _id: 'case|312-21_case|312-21|mapping',
              _index: 'efcms-message',
              _score: 1,
              _source: {
                docketNumber: {
                  S: '312-21',
                },
              },
              _type: '_doc',
            },
          ],
          max_score: 1,
          total: {
            relation: 'eq',
            value: 1,
          },
        },
      },
    },
  };

  it('should return sourceUnmarshalled when the case is not found in the caseMap and the docket no on the message does not match the case mapping docket no', async () => {
    const mockMessageNoMatchResult = {
      _id: 'case|312-21_case|312-21',
      _index: 'efcms-message',
      _score: 3.0612311,
      _source: {
        messageId: '034c6f2e-77e7-49bd-8e18-0256a72e12bd',
      },
      _type: '_doc',
      inner_hits: {
        'case-mappings': {
          hits: {
            hits: [
              {
                _id: 'case|312-21_case|312-21|mapping',
                _index: 'efcms-message',
                _score: 1,
                _source: {
                  docketNumber: {
                    S: '344-21',
                  },
                },
                _type: '_doc',
              },
            ],
            max_score: 1,
            total: {
              relation: 'eq',
              value: 1,
            },
          },
        },
      },
    };
    const mockSourceUnmarshalled = { marigold: false };

    const results = await formatMessageResult({
      caseMap: {},
      hit: mockMessageNoMatchResult,
      sourceUnmarshalled: mockSourceUnmarshalled,
    });

    expect(results).toEqual(mockSourceUnmarshalled);
  });

  it('should add the case to the caseMap and unmarshall when one is not found', async () => {
    const results = await formatMessageResult({
      caseMap: {},
      hit: mockMessageResult,
      sourceUnmarshalled: {},
    });

    expect(results).toEqual({
      docketNumber: '312-21',
    });
  });

  it('should unmarshall the case found in caseMap when one is found and return it as part of the formatted search result', async () => {
    const mockSourceUnmarshalled = {
      daisy: true,
    };
    const mockCaseMap = {
      '312-21': {
        leadDocketNumber: {
          S: '201-22',
        },
      },
    };

    const results = await formatMessageResult({
      caseMap: mockCaseMap,
      hit: mockMessageResult,
      sourceUnmarshalled: mockSourceUnmarshalled,
    });

    expect(results).toEqual({
      leadDocketNumber: '201-22',
      ...mockSourceUnmarshalled,
    });
  });
});
