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

const advancedSearchResults = {
  _shards: {
    failed: 0,
    skipped: 0,
    successful: 1,
    total: 1,
  },
  hits: {
    hits: [
      {
        _id: 'case|312-21_docket-entry|25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
        _index: 'efcms-docket-entry',
        _routing: 'case|312-21_case|312-21|mapping',
        _score: null,
        _source: {
          docketEntryId: {
            S: '25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
          },
          docketNumber: {
            S: '312-21',
          },
          documentTitle: {
            S: 'Order of Dismissal for Lack of Jurisdiction',
          },
          documentType: {
            S: 'Order of Dismissal for Lack of Jurisdiction',
          },
          eventCode: {
            S: 'ODJ',
          },
          filingDate: {
            S: '2021-08-20T18:16:39.420Z',
          },
          isStricken: {
            BOOL: false,
          },
          judge: {
            S: 'Carluzzo',
          },
          numberOfPages: {
            N: '2',
          },
          signedJudgeName: {
            S: 'Maurice B. Foley',
          },
        },
        _type: '_doc',
        inner_hits: {
          'case-mappings': {
            hits: {
              hits: [
                {
                  _id: 'case|312-21_case|312-21|mapping',
                  _index: 'efcms-docket-entry',
                  _score: 1,
                  _source: {
                    caseCaption: {
                      S: 'Brett Osborne, Petitioner',
                    },
                    docketNumber: {
                      S: '312-21',
                    },
                    docketNumberWithSuffix: {
                      S: '312-21W',
                    },
                    irsPractitioners: {
                      L: [],
                    },
                    isSealed: {
                      BOOL: false,
                    },
                    petitioners: {
                      L: [
                        {
                          M: {
                            address1: {
                              S: '68 Fabien Freeway',
                            },
                            address2: {
                              S: 'Suscipit animi solu',
                            },
                            address3: {
                              S: 'Architecto assumenda',
                            },
                            city: {
                              S: 'Aspernatur nostrum s',
                            },
                            contactId: {
                              S: '7805d1ab-18d0-43ec-bafb-654e83405416',
                            },
                            contactType: {
                              S: 'primary',
                            },
                            countryType: {
                              S: 'domestic',
                            },
                            email: {
                              S: 'petitioner@example.com',
                            },
                            isAddressSealed: {
                              BOOL: false,
                            },
                            name: {
                              S: 'Brett Osborne',
                            },
                            phone: {
                              S: '+1 (537) 235-6147',
                            },
                            postalCode: {
                              S: '89499',
                            },
                            sealedAndUnavailable: {
                              BOOL: false,
                            },
                            serviceIndicator: {
                              S: 'Electronic',
                            },
                            state: {
                              S: 'AK',
                            },
                          },
                        },
                      ],
                    },
                    privatePractitioners: {
                      L: [],
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
        sort: [1629483399420],
      },
    ],
    max_score: null,
    total: {
      relation: 'eq',
      value: 1,
    },
  },
  timed_out: false,
  took: 5,
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

  it('should unmarshall the case if it was not found in the caseMap', async () => {
    applicationContext
      .getSearchClient()
      .search.mockReturnValue(advancedSearchResults);

    const results = await search({
      applicationContext,
      searchParameters: {},
    });

    expect(results).toMatchObject({
      results: [
        {
          _score: null,
          caseCaption: 'Brett Osborne, Petitioner',
          docketEntryId: '25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
          docketNumber: '312-21',
          docketNumberWithSuffix: '312-21W',
          documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
          documentType: 'Order of Dismissal for Lack of Jurisdiction',
          eventCode: 'ODJ',
          filingDate: '2021-08-20T18:16:39.420Z',
          irsPractitioners: [],
          isSealed: false,
          isStricken: false,
          judge: 'Carluzzo',
          numberOfPages: 2,
          petitioners: [
            {
              address1: '68 Fabien Freeway',
              address2: 'Suscipit animi solu',
              address3: 'Architecto assumenda',
              city: 'Aspernatur nostrum s',
              contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
              contactType: 'primary',
              countryType: 'domestic',
              email: 'petitioner@example.com',
              isAddressSealed: false,
              name: 'Brett Osborne',
              phone: '+1 (537) 235-6147',
              postalCode: '89499',
              sealedAndUnavailable: false,
              serviceIndicator: 'Electronic',
              state: 'AK',
            },
          ],
          privatePractitioners: [],
          signedJudgeName: 'Maurice B. Foley',
        },
      ],
      total: 1,
    });
  });
});
