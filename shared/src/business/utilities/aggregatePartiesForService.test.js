const {
  CONTACT_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../entities/EntityConstants');
const { aggregatePartiesForService } = require('./aggregatePartiesForService');

describe('aggregatePartiesForService', () => {
  let mockCase;
  let irsPractitioners;
  let privatePractitioners;

  let irsPractitionerWithPaper;
  let privatePractitionerWithPaper;

  let otherFilers;
  let otherPetitioners;

  const PRIMARY_CONTACT_ID = 'c344c39f-6086-484b-998c-e93e9c7dcff5';
  const SECONDARY_CONTACT_ID = '09ecdf10-359c-4694-a5a8-d15d56796ce1';

  beforeEach(() => {
    const contactPrimary = {
      contactId: PRIMARY_CONTACT_ID,
      contactType: CONTACT_TYPES.primary,
      email: 'contactprimary@example.com',
      name: 'Contact Primary',
    };

    const contactSecondary = {
      address1: 'Test Address',
      city: 'Testville',
      contactId: SECONDARY_CONTACT_ID,
      contactType: CONTACT_TYPES.secondary,
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

    otherFilers = [
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactId: '9836050f-a423-47bb-943b-a5661fe08a6b',
        contactType: CONTACT_TYPES.participant,
        countryType: 'domestic',
        email: 'petitioner@example.com',
        inCareOf: 'Myself',
        name: 'Test Petitioner3',
        phone: '1234567',
        postalCode: '12345',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        state: 'TN',
        title: 'Tax Matters Partner',
      },
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactId: '8746050f-a423-47bb-943b-a5661fe08a6b',
        contactType: CONTACT_TYPES.intervenor,
        countryType: 'domestic',
        email: 'petitioner@example.com',
        inCareOf: 'Myself',
        name: 'Test Petitioner4',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Tax Matters Partner',
      },
    ];

    otherPetitioners = [
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactId: '6536050f-a423-47bb-943b-a5661fe08a6b',
        contactType: CONTACT_TYPES.otherPetitioner,
        countryType: 'domestic',
        email: 'petitioner5@example.com',
        inCareOf: 'Myself',
        name: 'Test Petitioner5',
        phone: '1234567',
        postalCode: '12345',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        state: 'TN',
        title: 'Tax Matters Partner',
      },
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactId: '5446050f-a423-47bb-943b-a5661fe08a6b',
        contactType: CONTACT_TYPES.otherPetitioner,
        countryType: 'domestic',
        email: 'petitioner6@example.com',
        inCareOf: 'Myself',
        name: 'Test Petitioner6',
        phone: '1234567',
        postalCode: '12345',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        state: 'TN',
        title: 'Tax Matters Partner',
      },
    ];

    mockCase = {
      irsPractitioners,
      petitioners: [contactPrimary, contactSecondary],
      privatePractitioners,
    };
  });

  it('should serve an unrepresented primary and secondary contact by paper if filed by paper', async () => {
    mockCase.petitioners = [
      { ...mockCase.petitioners[0], email: null },
      mockCase.petitioners[1],
    ];

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

  it('should serve any otherPetitioners by paper ONLY if their serviceIndicator is set to paper', () => {
    const result = aggregatePartiesForService({
      ...mockCase,
      petitioners: [
        ...mockCase.petitioners,
        ...otherFilers,
        ...otherPetitioners,
      ],
    });

    const otherPetitioner1 = result.paper.find(
      p => p.contactId === otherPetitioners[0].contactId,
    );
    const otherPetitioner2 = result.paper.find(
      p => p.contactId === otherPetitioners[1].contactId,
    );
    expect(otherPetitioner1).toBeTruthy();
    expect(otherPetitioner2).toBeFalsy();
  });

  it('should serve any otherFilers by paper if their serviceIndicator is set to paper', () => {
    const result = aggregatePartiesForService({
      ...mockCase,
      petitioners: [
        ...mockCase.petitioners,
        ...otherFilers,
        ...otherPetitioners,
      ],
    });

    const otherFiler = result.paper.find(
      p => p.contactId === otherFilers[0].contactId,
    );

    expect(otherFiler).toBeTruthy();
  });

  it('should not serve any otherFilers by paper if their serviceIndicator is set to none', () => {
    const result = aggregatePartiesForService({
      ...mockCase,
      petitioners: [
        ...mockCase.petitioners,
        {
          ...otherFilers[0],
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        ...otherPetitioners,
      ],
    });

    const otherFiler = result.paper.find(
      p => p.contactId === otherFilers[0].contactId,
    );

    expect(otherFiler).toBeFalsy();
  });
});
