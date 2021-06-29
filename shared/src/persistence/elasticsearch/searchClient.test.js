const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { search } = require('./searchClient');

const emptyResults = {
  _shards: { failed: 0, skipped: 0, successful: 1, total: 1 },
  hits: {
    hits: [],
    max_score: null,
    total: { relation: 'eq', value: 0 },
  },
  timed_out: false,
  took: 66,
};

const matchesResults = {
  _shards: { failed: 0, skipped: 0, successful: 1, total: 1 },
  hits: {
    hits: [
      {
        _id: 'case|102-20_case|102-20',
        _index: 'efcms-case',
        _score: 3.0612311,
        _source: {
          caseCaption: { S: 'Eve Brewer, Petitioner' },
          contactPrimary: {
            M: {
              address1: { S: '67 Oak Parkway' },
              city: { S: 'Nashville' },
              contactId: { S: '7805d1ab-18d0-43ec-bafb-654e83405416' },
              countryType: { S: 'domestic' },
              email: { S: 'petitioner@example.com' },
              name: { S: 'Eve Brewer' },
              phone: { S: '+1 (477) 640-5087' },
              postalCode: { S: '36042' },
              state: { S: 'TN' },
            },
          },
          contactSecondary: { M: {} },
          docketNumber: { S: '102-20' },
          docketNumberSuffix: { S: 'S' },
          docketNumberWithSuffix: { S: '102-20S' },
          irsPractitioners: {
            L: [
              {
                M: {
                  barNumber: { S: 'RT6789' },
                  contact: {
                    M: {
                      address1: { S: '234 Main St' },
                      address2: { S: 'Apartment 4' },
                      address3: { S: 'Under the stairs' },
                      city: { S: 'Chicago' },
                      countryType: { S: 'domestic' },
                      phone: { S: '+1 (555) 555-5555' },
                      postalCode: { S: '61234' },
                      state: { S: 'IL' },
                    },
                  },
                  email: { S: 'irsPractitioner@example.com' },
                  name: { S: 'Test IRS Practitioner' },
                  pk: { S: 'case|102-20' },
                  role: { S: 'irsPractitioner' },
                  section: { S: 'irsPractitioner' },
                  serviceIndicator: { S: 'Electronic' },
                  sk: {
                    S: 'irsPractitioner|5805d1ab-18d0-43ec-bafb-654e83405416',
                  },
                  userId: { S: '5805d1ab-18d0-43ec-bafb-654e83405416' },
                },
              },
            ],
          },
          privatePractitioners: {
            L: [
              {
                M: {
                  barNumber: { S: 'PT5432' },
                  contact: {
                    M: {
                      address1: { S: '234 Main St' },
                      address2: { S: 'Apartment 4' },
                      address3: { S: 'Under the stairs' },
                      city: { S: 'Chicago' },
                      countryType: { S: 'domestic' },
                      phone: { S: '+1 (555) 555-5555' },
                      postalCode: { S: '61234' },
                      state: { S: 'IL' },
                    },
                  },
                  email: { S: 'privatePractitioner1@example.com' },
                  name: { S: 'Test Private Practitioner' },
                  pk: { S: 'case|102-20' },
                  representingPrimary: { BOOL: true },
                  role: { S: 'privatePractitioner' },
                  section: { S: 'privatePractitioner' },
                  serviceIndicator: { S: 'Electronic' },
                  sk: {
                    S: 'privatePractitioner|ad07b846-8933-4778-9fe2-b5d8ac8ad728',
                  },
                  userId: { S: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728' },
                },
              },
            ],
          },
          receivedAt: { S: '2020-01-21T16:41:39.474Z' },
          sealedDate: { S: '2020-01-21T16:48:28.364Z' },
        },
        _type: '_doc',
      },
    ],
    max_score: 3.0612311,
    total: { relation: 'eq', value: 1 },
  },
  timed_out: false,
  took: 7,
};

describe('searchClient', () => {
  it('finds no hits', async () => {
    applicationContext.getSearchClient().search.mockReturnValue(emptyResults);
    const results = await search({
      applicationContext,
      searchParameters: {},
    });

    expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
      1,
    );
    expect(results).toMatchObject({ results: [], total: 0 });
  });

  it('returns a query exception of some kind', async () => {
    applicationContext
      .getSearchClient()
      .search.mockImplementation(() =>
        Promise.reject(new Error('malformed elasticsearch query syntax error')),
      );

    await expect(
      search({
        applicationContext,
        searchParameters: { some: '[bad: $syntax -=error' },
      }),
    ).rejects.toThrow('Search client encountered an error.');

    expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
      1,
    );
    expect(applicationContext.logger.error).toHaveBeenCalledTimes(1);
  });

  it('finds hits and formats them', async () => {
    applicationContext.getSearchClient().search.mockReturnValue(matchesResults);
    const results = await search({
      applicationContext,
      searchParameters: {},
    });

    expect(applicationContext.getSearchClient().search).toHaveBeenCalledTimes(
      1,
    );
    expect(results).toMatchObject({
      results: [
        {
          _score: expect.anything(),
          caseCaption: 'Eve Brewer, Petitioner',
          contactPrimary: {
            address1: '67 Oak Parkway',
            city: 'Nashville',
            contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            countryType: 'domestic',
            email: 'petitioner@example.com',
            name: 'Eve Brewer',
            phone: '+1 (477) 640-5087',
            postalCode: '36042',
            state: 'TN',
          },
          contactSecondary: {},
          docketNumber: '102-20',
          docketNumberSuffix: 'S',
          docketNumberWithSuffix: '102-20S',
          irsPractitioners: [
            {
              barNumber: 'RT6789',
              contact: {
                address1: '234 Main St',
                address2: 'Apartment 4',
                address3: 'Under the stairs',
                city: 'Chicago',
                countryType: 'domestic',
                phone: '+1 (555) 555-5555',
                postalCode: '61234',
                state: 'IL',
              },
              email: 'irsPractitioner@example.com',
              name: 'Test IRS Practitioner',
              pk: 'case|102-20',
              role: 'irsPractitioner',
              section: 'irsPractitioner',
              serviceIndicator: 'Electronic',
              sk: 'irsPractitioner|5805d1ab-18d0-43ec-bafb-654e83405416',
              userId: '5805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
          privatePractitioners: [
            {
              barNumber: 'PT5432',
              contact: {
                address1: '234 Main St',
                address2: 'Apartment 4',
                address3: 'Under the stairs',
                city: 'Chicago',
                countryType: 'domestic',
                phone: '+1 (555) 555-5555',
                postalCode: '61234',
                state: 'IL',
              },
              email: 'privatePractitioner1@example.com',
              name: 'Test Private Practitioner',
              pk: 'case|102-20',
              representingPrimary: true,
              role: 'privatePractitioner',
              section: 'privatePractitioner',
              serviceIndicator: 'Electronic',
              sk: 'privatePractitioner|ad07b846-8933-4778-9fe2-b5d8ac8ad728',
              userId: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
            },
          ],
          receivedAt: '2020-01-21T16:41:39.474Z',
          sealedDate: '2020-01-21T16:48:28.364Z',
        },
      ],
      total: 1,
    });
  });
});
