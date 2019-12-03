const { casePublicSearchInteractor } = require('./casePublicSearchInteractor');
import { CaseSearch } from '../entities/cases/CaseSearch';
import { formatNow } from '../utilities/DateHandler';

describe('casePublicSearchInteractor', () => {
  let searchSpy;

  const applicationContext = {
    environment: { stage: 'local' },
    getSearchClient: () => ({
      search: searchSpy,
    }),
    getUtilities: () => ({
      formatNow,
    }),
  };

  it('returns empty array if no search params are passed in', async () => {
    searchSpy = jest.fn(async () => {
      return {};
    });

    const results = await casePublicSearchInteractor({
      applicationContext,
    });

    expect(results).toEqual([]);
  });

  it('calls search function with correct params and returns records for an exact match result', async () => {
    searchSpy = jest.fn(async () => {
      return {
        hits: {
          hits: [
            {
              _source: {
                caseCaption: { S: 'Test Case Caption One' },
                caseId: { S: '1' },
                docketNumber: { S: '123-19' },
                docketNumberSuffix: { S: 'S' },
                receivedAt: { S: '2019-03-01T21:40:46.415Z' },
              },
            },
            {
              _source: {
                caseCaption: { S: 'Test Case Caption Two' },
                caseId: { S: '2' },
                docketNumber: { S: '456-19' },
                docketNumberSuffix: { S: 'S' },
                receivedAt: { S: '2019-03-01T21:40:46.415Z' },
              },
            },
          ],
        },
      };
    });

    const results = await casePublicSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        bool: {
          should: [
            {
              bool: {
                minimum_should_match: 2,
                should: [
                  { term: { 'contactPrimary.M.name.S': 'test' } },
                  { term: { 'contactPrimary.M.name.S': 'person' } },
                ],
              },
            },
            {
              bool: {
                minimum_should_match: 2,
                should: [
                  { term: { 'contactPrimary.M.secondaryName.S': 'test' } },
                  { term: { 'contactPrimary.M.secondaryName.S': 'person' } },
                ],
              },
            },
            {
              bool: {
                minimum_should_match: 2,
                should: [
                  { term: { 'contactSecondary.M.name.S': 'test' } },
                  { term: { 'contactSecondary.M.name.S': 'person' } },
                ],
              },
            },
          ],
        },
      },
    ]);
    expect(results).toEqual([
      {
        caseCaption: 'Test Case Caption One',
        caseId: '1',
        caseTitle: undefined,
        contactPrimary: undefined,
        contactSecondary: undefined,
        createdAt: undefined,
        docketNumber: '123-19',
        docketNumberSuffix: 'S',
        docketRecord: [],
        documents: [],
        receivedAt: '2019-03-01T21:40:46.415Z',
      },
      {
        caseCaption: 'Test Case Caption Two',
        caseId: '2',
        caseTitle: undefined,
        contactPrimary: undefined,
        contactSecondary: undefined,
        createdAt: undefined,
        docketNumber: '456-19',
        docketNumberSuffix: 'S',
        docketRecord: [],
        documents: [],
        receivedAt: '2019-03-01T21:40:46.415Z',
      },
    ]);
  });

  it('calls search function with correct params and returns records for a nonexact match result', async () => {
    const commonExpectedQuery = [
      {
        bool: {
          should: [
            { match: { 'contactPrimary.M.countryType.S': 'domestic' } },
            { match: { 'contactSecondary.M.countryType.S': 'domestic' } },
          ],
        },
      },
      {
        bool: {
          should: [
            { match: { 'contactPrimary.M.state.S': 'Nebraska' } },
            { match: { 'contactSecondary.M.state.S': 'Nebraska' } },
          ],
        },
      },
      {
        range: {
          'receivedAt.S': {
            format: 'yyyy',
            gte: '2018||/y',
            lte: '2019||/y',
          },
        },
      },
    ];

    searchSpy = jest.fn(async args => {
      //expected args for an exact matches search
      if (args.body.query.bool.must[0].bool.should[0].bool) {
        return {
          hits: {},
        };
      } else {
        return {
          hits: {
            hits: [
              {
                _source: {
                  caseCaption: { S: 'Test Case Caption One' },
                  caseId: { S: '1' },
                  contactPrimary: { O: {} },
                  contactSecondary: { O: {} },
                  docketNumber: { S: '123-19' },
                  docketNumberSuffix: { S: 'S' },
                  receivedAt: { S: '2019-03-01T21:40:46.415Z' },
                },
              },
              {
                _source: {
                  caseCaption: { S: 'Test Case Caption Two' },
                  caseId: { S: '2' },
                  contactPrimary: { O: {} },
                  contactSecondary: { O: {} },
                  docketNumber: { S: '456-19' },
                  docketNumberSuffix: { S: 'S' },
                  receivedAt: { S: '2019-03-01T21:40:46.415Z' },
                },
              },
            ],
          },
        };
      }
    });

    const results = await casePublicSearchInteractor({
      applicationContext,
      countryType: 'domestic',
      petitionerName: 'test person',
      petitionerState: 'Nebraska',
      yearFiledMax: '2019',
      yearFiledMin: '2018',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        bool: {
          should: [
            {
              bool: {
                minimum_should_match: 2,
                should: [
                  { term: { 'contactPrimary.M.name.S': 'test' } },
                  { term: { 'contactPrimary.M.name.S': 'person' } },
                ],
              },
            },
            {
              bool: {
                minimum_should_match: 2,
                should: [
                  { term: { 'contactPrimary.M.secondaryName.S': 'test' } },
                  { term: { 'contactPrimary.M.secondaryName.S': 'person' } },
                ],
              },
            },
            {
              bool: {
                minimum_should_match: 2,
                should: [
                  { term: { 'contactSecondary.M.name.S': 'test' } },
                  { term: { 'contactSecondary.M.name.S': 'person' } },
                ],
              },
            },
          ],
        },
      },
      ...commonExpectedQuery,
    ]);
    expect(searchSpy.mock.calls[1][0].body.query.bool.must).toEqual([
      {
        bool: {
          should: [
            { match: { 'contactPrimary.M.name.S': 'test person' } },
            { match: { 'contactPrimary.M.secondaryName.S': 'test person' } },
            { match: { 'contactSecondary.M.name.S': 'test person' } },
          ],
        },
      },
      ...commonExpectedQuery,
    ]);
    expect(results).toEqual([
      {
        caseCaption: 'Test Case Caption One',
        caseId: '1',
        caseTitle: undefined,
        contactPrimary: undefined,
        contactSecondary: undefined,
        createdAt: undefined,
        docketNumber: '123-19',
        docketNumberSuffix: 'S',
        docketRecord: [],
        documents: [],
        receivedAt: '2019-03-01T21:40:46.415Z',
      },
      {
        caseCaption: 'Test Case Caption Two',
        caseId: '2',
        caseTitle: undefined,
        contactPrimary: undefined,
        contactSecondary: undefined,
        createdAt: undefined,
        docketNumber: '456-19',
        docketNumberSuffix: 'S',
        docketRecord: [],
        documents: [],
        receivedAt: '2019-03-01T21:40:46.415Z',
      },
    ]);
  });

  it('uses a default minimum year when providing only a maximum year', async () => {
    searchSpy = jest.fn();

    await casePublicSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
      yearFiledMax: '2018',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must[1].range).toEqual({
      'receivedAt.S': {
        format: 'yyyy',
        gte: `${CaseSearch.CASE_SEARCH_MIN_YEAR}||/y`,
        lte: '2018||/y',
      },
    });
  });

  it('uses a default maximum year when providing only a minimum year', async () => {
    searchSpy = jest.fn();
    const currentYear = formatNow('YYYY');

    await casePublicSearchInteractor({
      applicationContext,
      petitionerName: 'test person',
      yearFiledMin: '2016',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must[1].range).toEqual({
      'receivedAt.S': {
        format: 'yyyy',
        gte: '2016||/y',
        lte: `${currentYear}||/y`,
      },
    });
  });
});
