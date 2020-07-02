const { aggregatePartiesForService } = require('./aggregatePartiesForService');
const { SERVICE_INDICATOR_TYPES } = require('../entities/EntityConstants');

describe('aggregatePartiesForService', () => {
  let mockCase;
  let irsPractitioners;

  beforeEach(() => {
    const contactPrimary = {
      email: 'contactprimary@example.com',
      name: 'Contact Primary',
    };

    const contactSecondary = {
      address1: 'Test Address',
      city: 'Testville',
      name: 'Contact Secondary',
      state: 'CA',
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
    ];

    const privatePractitioners = [
      {
        email: 'practitionerone@example.com',
        name: 'Practitioner One',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: 'p1',
      },
      {
        email: 'practitionertwo@example.com',
        name: 'Practitioner Two',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: 'p2',
      },
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
      ],
    });
  });

  it('should not serve the primary contact electronically or by paper if represented by counsel, but should serve the secondary contact by paper', async () => {
    mockCase.privatePractitioners[0].representingPrimary = true;
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
      ],
    });
  });

  it('should serve all irsPractitioners electronically', async () => {
    mockCase.privatePractitioners = [];
    const result = aggregatePartiesForService(mockCase);

    expect(result.electronic.length).toEqual(irsPractitioners.length + 1);
  });
});
