const { aggregatePartiesForService } = require('./aggregatePartiesForService');
const { SERVICE_INDICATOR_TYPES } = require('../entities/EntityConstants');

describe('aggregatePartiesForService', () => {
  let mockCase;
  let irsPractitioners;
  let privatePractitioners;

  let irsPractitionerWithPaper;
  let privatePractitionerWithPaper;

  const PRIMARY_CONTACT_ID = 'c344c39f-6086-484b-998c-e93e9c7dcff5';
  const SECONDARY_CONTACT_ID = '09ecdf10-359c-4694-a5a8-d15d56796ce1';

  beforeEach(() => {
    const contactPrimary = {
      contactId: PRIMARY_CONTACT_ID,
      email: 'contactprimary@example.com',
      name: 'Contact Primary',
    };

    const contactSecondary = {
      address1: 'Test Address',
      city: 'Testville',
      contactId: SECONDARY_CONTACT_ID,
      name: 'Contact Secondary',
      state: 'CA',
    };

    irsPractitionerWithPaper = {
      contact: {
        address1: '123 IRS Way',
        address2: null,
        address3: null,
        city: 'Washington',
        country: undefined,
        countryType: 'domestic',
        phone: '1234567890',
        postalCode: '48839',
        state: 'DC',
      },
      name: 'Respondent Three',
      representing: [],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      userId: 'r3',
    };

    irsPractitioners = [
      {
        email: 'respondentone@example.com',
        name: 'Respondent One',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      {
        email: 'respondenttwo@example.com',
        name: 'Respondent Two',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
      irsPractitionerWithPaper,
    ];

    privatePractitionerWithPaper = {
      contact: {
        address1: 'Suite 111 1st Floor',
        address2: '123 Main Street',
        address3: null,
        city: 'Somewhere',
        country: undefined,
        countryType: 'domestic',
        phone: '1234567890',
        postalCode: '48839',
        state: 'TN',
      },
      name: 'Practitioner Three',
      representing: [],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      userId: 'p3',
    };

    privatePractitioners = [
      {
        email: 'practitionerone@example.com',
        name: 'Practitioner One',
        representing: [],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: 'p1',
      },
      {
        email: 'practitionertwo@example.com',
        name: 'Practitioner Two',
        representing: [],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: 'p2',
      },
      privatePractitionerWithPaper,
    ];

    mockCase = {
      contactPrimary,
      contactSecondary,
      irsPractitioners,
      privatePractitioners,
    };
  });

  it('should serve an unrepresented primary and secondary contact by paper if filed by paper', async () => {
    mockCase.isPaper = true;
    const result = aggregatePartiesForService(mockCase);

    expect(result).toMatchObject({
      all: [
        { email: 'practitionerone@example.com', name: 'Practitioner One' },
        { email: 'practitionertwo@example.com', name: 'Practitioner Two' },
        { email: 'respondentone@example.com', name: 'Respondent One' },
        { email: 'respondenttwo@example.com', name: 'Respondent Two' },
        { name: 'Contact Primary' },
        {
          address1: 'Test Address',
          city: 'Testville',
          name: 'Contact Secondary',
          state: 'CA',
        },
        {
          ...privatePractitionerWithPaper,
          ...privatePractitionerWithPaper.contact,
        },
        { ...irsPractitionerWithPaper, ...irsPractitionerWithPaper.contact },
      ],
      electronic: [
        { email: 'practitionerone@example.com', name: 'Practitioner One' },
        { email: 'practitionertwo@example.com', name: 'Practitioner Two' },
        { email: 'respondentone@example.com', name: 'Respondent One' },
        { email: 'respondenttwo@example.com', name: 'Respondent Two' },
      ],
      paper: [
        { name: 'Contact Primary' },
        {
          address1: 'Test Address',
          city: 'Testville',
          name: 'Contact Secondary',
          state: 'CA',
        },
        {
          ...privatePractitionerWithPaper,
          ...privatePractitionerWithPaper.contact,
        },
        { ...irsPractitionerWithPaper, ...irsPractitionerWithPaper.contact },
      ],
    });
  });

  it('should serve an unrepresented primary contact electronically and an unrepresented secondary contact by paper if filed electronically', async () => {
    const result = aggregatePartiesForService(mockCase);

    expect(result).toMatchObject({
      all: [
        { email: 'contactprimary@example.com', name: 'Contact Primary' },
        { email: 'practitionerone@example.com', name: 'Practitioner One' },
        { email: 'practitionertwo@example.com', name: 'Practitioner Two' },
        { email: 'respondentone@example.com', name: 'Respondent One' },
        { email: 'respondenttwo@example.com', name: 'Respondent Two' },
        {
          address1: 'Test Address',
          city: 'Testville',
          name: 'Contact Secondary',
          state: 'CA',
        },
        {
          ...privatePractitionerWithPaper,
          ...privatePractitionerWithPaper.contact,
        },
        { ...irsPractitionerWithPaper, ...irsPractitionerWithPaper.contact },
      ],
      electronic: [
        { email: 'contactprimary@example.com', name: 'Contact Primary' },
        { email: 'practitionerone@example.com', name: 'Practitioner One' },
        { email: 'practitionertwo@example.com', name: 'Practitioner Two' },
        { email: 'respondentone@example.com', name: 'Respondent One' },
        { email: 'respondenttwo@example.com', name: 'Respondent Two' },
      ],
      paper: [
        {
          address1: 'Test Address',
          city: 'Testville',
          name: 'Contact Secondary',
          state: 'CA',
        },
        {
          ...privatePractitionerWithPaper,
          ...privatePractitionerWithPaper.contact,
        },
        { ...irsPractitionerWithPaper, ...irsPractitionerWithPaper.contact },
      ],
    });
  });

  it('should not serve the primary contact electronically or by paper if represented by counsel, but should serve the secondary contact by paper', async () => {
    mockCase.privatePractitioners[0].representing = [PRIMARY_CONTACT_ID];
    const result = aggregatePartiesForService(mockCase);

    expect(result).toMatchObject({
      all: [
        { email: 'practitionerone@example.com', name: 'Practitioner One' },
        { email: 'practitionertwo@example.com', name: 'Practitioner Two' },
        { email: 'respondentone@example.com', name: 'Respondent One' },
        { email: 'respondenttwo@example.com', name: 'Respondent Two' },
        {
          address1: 'Test Address',
          city: 'Testville',
          name: 'Contact Secondary',
          state: 'CA',
        },
        {
          ...privatePractitionerWithPaper,
          ...privatePractitionerWithPaper.contact,
        },
        { ...irsPractitionerWithPaper, ...irsPractitionerWithPaper.contact },
      ],
      electronic: [
        { email: 'practitionerone@example.com', name: 'Practitioner One' },
        { email: 'practitionertwo@example.com', name: 'Practitioner Two' },
        { email: 'respondentone@example.com', name: 'Respondent One' },
        { email: 'respondenttwo@example.com', name: 'Respondent Two' },
      ],
      paper: [
        {
          address1: 'Test Address',
          city: 'Testville',
          name: 'Contact Secondary',
          state: 'CA',
        },
        {
          ...privatePractitionerWithPaper,
          ...privatePractitionerWithPaper.contact,
        },
        { ...irsPractitionerWithPaper, ...irsPractitionerWithPaper.contact },
      ],
    });
  });

  it('should serve all practitioners with an email address electronically', async () => {
    const result = aggregatePartiesForService(mockCase);

    const foundPrivatePractitionerWithPaper = result.electronic.find(
      user => user.userId === privatePractitionerWithPaper.userId,
    );

    const foundIrsPractitionerWithPaper = result.electronic.find(
      user => user.userId === irsPractitionerWithPaper.userId,
    );

    expect(result.electronic.length).toEqual(5);
    expect(foundPrivatePractitionerWithPaper).toBeFalsy();
    expect(foundIrsPractitionerWithPaper).toBeFalsy();
  });

  it('should serve all practitioners without an email address by paper', async () => {
    const result = aggregatePartiesForService(mockCase);

    const foundPrivatePractitionerWithPaper = result.paper.find(
      user => user.userId === privatePractitionerWithPaper.userId,
    );

    const foundIrsPractitionerWithPaper = result.paper.find(
      user => user.userId === irsPractitionerWithPaper.userId,
    );

    expect(result.paper.length).toEqual(3);
    expect(foundPrivatePractitionerWithPaper).toBeTruthy();
    expect(foundIrsPractitionerWithPaper).toBeTruthy();
  });
});
