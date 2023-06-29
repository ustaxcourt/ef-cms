import { formatDocketEntryResult } from './formatDocketEntryResult';

describe('formatDocketEntryResult', () => {
  const mockDocketEntryResult = {
    _id: 'case|312-21_case|312-21',
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
      docketNumber: { S: '312-21' },
      docketNumberSuffix: { S: 'S' },
      docketNumberWithSuffix: { S: '312-21S' },
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
              email: { S: 'irspractitioner@example.com' },
              name: { S: 'Test IRS Practitioner' },
              pk: { S: 'case|312-21' },
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
              email: { S: 'privatepractitioner1@example.com' },
              name: { S: 'Test Private Practitioner' },
              pk: { S: 'case|312-21' },
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
    inner_hits: {
      'case-mappings': {
        hits: {
          hits: [
            {
              _id: 'case|312-21_case|312-21|mapping',
              _index: 'efcms-docket-entry',
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

  it('should return sourceUnmarshalled when the case is not found in the caseMap and the docket no on the docket entry does not match the case mapping docket no', async () => {
    const mockDocketEntryUnMatchingResult = {
      _id: 'case|312-21_case|312-21',
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
        docketNumber: { S: '312-21' },
        docketNumberSuffix: { S: 'S' },
        docketNumberWithSuffix: { S: '312-21S' },
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
                email: { S: 'irspractitioner@example.com' },
                name: { S: 'Test IRS Practitioner' },
                pk: { S: 'case|312-21' },
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
                email: { S: 'privatepractitioner1@example.com' },
                name: { S: 'Test Private Practitioner' },
                pk: { S: 'case|312-21' },
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
      inner_hits: {
        'case-mappings': {
          hits: {
            hits: [
              {
                _id: 'case|312-21_case|312-21|mapping',
                _index: 'efcms-docket-entry',
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

    const results = await formatDocketEntryResult({
      caseMap: {},
      hit: mockDocketEntryUnMatchingResult,
      sourceUnmarshalled: mockSourceUnmarshalled,
    });

    expect(results).toEqual(mockSourceUnmarshalled);
  });

  it('should add the case to the caseMap and unmarshall when one is not found', async () => {
    const results = await formatDocketEntryResult({
      caseMap: {},
      hit: mockDocketEntryResult,
      sourceUnmarshalled: { isSealed: true },
    });

    expect(results).toEqual({
      docketNumber: '312-21',
      isCaseSealed: false,
      isDocketEntrySealed: true,
      isSealed: undefined,
    });
  });

  it('should unmarshall the case found in caseMap when one is found and populate sealed properties', async () => {
    const mockCaseMap = {
      '312-21': {
        isSealed: {
          BOOL: true,
        },
      },
    };

    const results = await formatDocketEntryResult({
      caseMap: mockCaseMap,
      hit: mockDocketEntryResult,
      sourceUnmarshalled: { isSealed: true },
    });

    expect(results).toEqual({
      isCaseSealed: true,
      isDocketEntrySealed: true,
      isSealed: undefined,
    });
  });
});
