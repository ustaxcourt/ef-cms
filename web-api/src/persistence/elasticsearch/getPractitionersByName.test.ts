import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getPractitionersByName } from './getPractitionersByName';
jest.mock('./searchClient');
import { search } from './searchClient';

describe('getPractitionersByName', () => {
  it('returns results from a single persistence query', async () => {
    (search as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        results: [
          { barNumber: '009', name: 'other' },
          { barNumber: '005', name: 'matches' },
        ],
        total: 2,
      }),
    );

    const { results } = await getPractitionersByName(applicationContext, {
      name: 'some practitioner name',
      searchAfter: [],
    });

    const searchCalls = (search as jest.Mock).mock.calls;
    expect(searchCalls.length).toEqual(1);
    expect(searchCalls[0][0].searchParameters).toMatchObject({
      body: {
        _source: [
          'admissionsStatus',
          'admissionsDate',
          'barNumber',
          'contact',
          'name',
          'originalBarState',
          'practitionerType',
          'practiceType',
        ],
      },
    });
    expect(results.length).toBe(2);
  });

  it('should use the last item in results sort key', async () => {
    (search as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        results: [
          { barNumber: '009', name: 'other' },
          { barNumber: '005', name: 'matches', sort: 'SOME_RANDOM_SORT_KEY' },
        ],
        total: 2,
      }),
    );

    const { lastKey } = await getPractitionersByName(applicationContext, {
      name: 'some practitioner name',
      searchAfter: [],
    });

    expect(lastKey).toBe('SOME_RANDOM_SORT_KEY');
  });

  it('should return an empty lastKey when no results are returned', async () => {
    (search as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        results: [],
        total: 0,
      }),
    );

    const { lastKey } = await getPractitionersByName(applicationContext, {
      name: 'some practitioner name',
    });

    expect(lastKey).toEqual([]);
  });

  it('should add filters when practitionerType, practiceType, admissionStatus, and originalBarState are provided', async () => {
    (search as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        results: [],
        total: 0,
      }),
    );

    await getPractitionersByName(applicationContext, {
      admissionStatus: ['Active'],
      name: 'some practitioner name',
      originalBarState: ['NY'],
      practiceType: ['Private'],
      practitionerType: 'Petitioner',
    });

    const searchCalls = (search as jest.Mock).mock.calls;
    const mustClauses =
      searchCalls[searchCalls.length - 1][0].searchParameters.body.query.bool
        .must;
    expect(mustClauses).toEqual(
      expect.arrayContaining([
        { term: { 'practitionerType.S': 'Petitioner' } },
        { terms: { 'practiceType.S': ['Private'] } },
        { terms: { 'admissionsStatus.S': ['Active'] } },
        { terms: { 'originalBarState.S': ['NY'] } },
      ]),
    );
  });
});
