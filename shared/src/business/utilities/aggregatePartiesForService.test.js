const { aggregatePartiesForService } = require('./aggregatePartiesForService');

describe('aggregatePartiesForService', () => {
  let mockCase;

  const contactPrimary = {
    email: 'contactprimary@example.com',
    name: 'Contact Primary',
  };

  const contactSecondary = {
    name: 'Contact Secondary',
  };

  const respondents = [
    {
      email: 'respondentone@example.com',
      name: 'Respondent One',
    },
    {
      email: 'respondenttwo@example.com',
      name: 'Respondent Two',
    },
  ];

  const practitioners = [
    {
      email: 'practitionerone@example.com',
      name: 'Practitioner One',
      userId: 'p1',
    },
    {
      email: 'practitionertwo@example.com',
      name: 'Practitioner Two',
      userId: 'p2',
    },
  ];

  beforeEach(() => {
    mockCase = {
      contactPrimary,
      contactSecondary,
      practitioners,
      respondents,
    };
  });

  it('should not serve an unrepresented primary contact if filed by paper', async () => {
    mockCase.isPaper = true;
    const result = aggregatePartiesForService(mockCase);

    expect(result).toMatchObject({
      electronic: [
        { email: 'practitionerone@example.com', name: 'Practitioner One' },
        { email: 'practitionertwo@example.com', name: 'Practitioner Two' },
        { email: 'respondentone@example.com', name: 'Respondent One' },
        { email: 'respondenttwo@example.com', name: 'Respondent Two' },
      ],
    });
  });

  it('should serve an unrepresented primary contact if filed electronically', async () => {
    const result = aggregatePartiesForService(mockCase);

    expect(result).toMatchObject({
      electronic: [
        { email: 'contactprimary@example.com', name: 'Contact Primary' },
        { email: 'practitionerone@example.com', name: 'Practitioner One' },
        { email: 'practitionertwo@example.com', name: 'Practitioner Two' },
        { email: 'respondentone@example.com', name: 'Respondent One' },
        { email: 'respondenttwo@example.com', name: 'Respondent Two' },
      ],
    });
  });

  it('should not serve the primary contact if represented by counsel', async () => {
    mockCase.practitioners[0].representingPrimary = true;
    const result = aggregatePartiesForService(mockCase);

    expect(result).toMatchObject({
      electronic: [
        { email: 'practitionerone@example.com', name: 'Practitioner One' },
        { email: 'practitionertwo@example.com', name: 'Practitioner Two' },
        { email: 'respondentone@example.com', name: 'Respondent One' },
        { email: 'respondenttwo@example.com', name: 'Respondent Two' },
      ],
    });
  });

  it('should serve all respondents electronically', async () => {
    mockCase.practitioners = [];
    const result = aggregatePartiesForService(mockCase);

    expect(result.electronic.length).toEqual(respondents.length + 1);
  });
});
