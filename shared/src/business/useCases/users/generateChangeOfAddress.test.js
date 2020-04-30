const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { generateChangeOfAddress } = require('./generateChangeOfAddress');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('generateChangeOfAddress', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'docketclerk',
      userId: 'docketclerk',
    });
    applicationContext.getPersistenceGateway().getCasesByUser.mockReturnValue([
      {
        ...MOCK_CASE,
        privatePractitioners: [
          {
            barNumber: 'PT5432',
            contact: {
              address1: '234 Main St!',
              address2: 'Apartment 4',
              address3: 'Under the stairs',
              city: 'Chicago',
              countryType: 'domestic',
              phone: '+1 (555) 555-5555',
              postalCode: '61234',
              state: 'IL',
            },
            email: 'privatePractitioner1',
            name: 'Test Private Practitioner',
            representingPrimary: true,
            role: 'privatePractitioner',
            section: 'privatePractitioner',
            serviceIndicator: 'Electronic',
            userId: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
          },
        ],
        userId: 'abc',
      },
    ]);
  });

  it('attempts to run a change of address when address1 changes', async () => {
    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        countryType: 'domestic',
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      user: {
        barNumber: 'PT5432',
        contact: {
          address1: '234 Main St!',
          address2: 'Apartment 4',
          address3: 'Under the stairs',
          city: 'Chicago',
          countryType: 'domestic',
          phone: '+1 (555) 555-5555',
          postalCode: '61234',
          state: 'IL',
        },
        email: 'privatePractitioner1',
        name: 'Test Private Practitioner',
        representingPrimary: true,
        role: 'privatePractitioner',
        section: 'privatePractitioner',
        serviceIndicator: 'Electronic',
        userId: 'ad07b846-8933-4778-9fe2-b5d8ac8ad728',
      },
    });
    expect(cases).toEqual(undefined);
  });
});
