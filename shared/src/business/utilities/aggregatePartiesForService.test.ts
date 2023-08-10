import {
  MOCK_CONTACT_PRIMARY,
  MOCK_CONTACT_SECONDARY,
} from '../../test/mockContact';
import { RawContact } from '../entities/contacts/Contact';
import { SERVICE_INDICATOR_TYPES } from '../entities/EntityConstants';
import { aggregatePartiesForService } from './aggregatePartiesForService';

describe('aggregatePartiesForService', () => {
  let mockCase;

  let contactPrimary: RawContact;
  let contactSecondary: RawContact;

  let privatePractitionerWithPaper;
  let privatePractitionerWithEmail;

  let irsPractitionerWithPaper;
  let irsPractitionerWithEmail;

  beforeEach(() => {
    contactPrimary = {
      ...MOCK_CONTACT_PRIMARY,
      serviceIndicator: undefined,
    };

    contactSecondary = {
      ...MOCK_CONTACT_SECONDARY,
      serviceIndicator: undefined,
    };

    privatePractitionerWithEmail = {
      email: 'practitionerone@example.com',
      name: 'Practitioner One',
      representing: [],
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      userId: 'p1',
    };

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

    irsPractitionerWithEmail = {
      email: 'respondentone@example.com',
      name: 'Respondent One',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
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

    mockCase = {
      irsPractitioners: [irsPractitionerWithEmail, irsPractitionerWithPaper],
      petitioners: [contactPrimary, contactSecondary],
      privatePractitioners: [
        privatePractitionerWithEmail,
        privatePractitionerWithPaper,
      ],
    };
  });

  it('should serve an unrepresented primary and secondary contact by paper when neither party has provided an email on their account', () => {
    contactPrimary.email = undefined;
    contactSecondary.email = undefined;
    mockCase.petitioners = [contactPrimary, contactSecondary];
    mockCase.privatePractitioners = [];

    const result = aggregatePartiesForService(mockCase);

    expect(result).toMatchObject({
      all: [
        { email: 'respondentone@example.com', name: 'Respondent One' },
        contactPrimary,
        contactSecondary,
        { ...irsPractitionerWithPaper, ...irsPractitionerWithPaper.contact },
      ],
      electronic: [
        { email: 'respondentone@example.com', name: 'Respondent One' },
      ],
      paper: [
        contactPrimary,
        contactSecondary,
        { ...irsPractitionerWithPaper, ...irsPractitionerWithPaper.contact },
      ],
    });
  });

  it('should serve an unrepresented primary contact electronically and an unrepresented secondary contact by paper when the primary contact has provided an email and the secondary contact has not', () => {
    contactPrimary.email = 'contact_primary@email.com';
    contactSecondary.email = undefined;
    mockCase.petitioners = [contactPrimary, contactSecondary];
    mockCase.privatePractitioners = [];

    const result = aggregatePartiesForService(mockCase);

    expect(result).toMatchObject({
      all: [
        { email: contactPrimary.email, name: contactPrimary.name },
        { email: 'respondentone@example.com', name: 'Respondent One' },
        contactSecondary,
        { ...irsPractitionerWithPaper, ...irsPractitionerWithPaper.contact },
      ],
      electronic: [
        { email: contactPrimary.email, name: contactPrimary.name },
        { email: 'respondentone@example.com', name: 'Respondent One' },
      ],
      paper: [
        contactSecondary,
        { ...irsPractitionerWithPaper, ...irsPractitionerWithPaper.contact },
      ],
    });
  });

  it('should not serve the primary contact electronically or by paper when they are represented by counsel and should serve the secondary contact by paper when they are not represented', () => {
    contactSecondary.email = undefined;
    mockCase.petitioners = [contactPrimary, contactSecondary];
    privatePractitionerWithEmail.representing = [contactPrimary.contactId];
    mockCase.privatePractitioners = [privatePractitionerWithEmail];

    const result = aggregatePartiesForService(mockCase);

    expect(result).toMatchObject({
      all: [
        {
          email: privatePractitionerWithEmail.email,
          name: privatePractitionerWithEmail.name,
        },
        { email: 'respondentone@example.com', name: 'Respondent One' },
        contactSecondary,
        { ...irsPractitionerWithPaper, ...irsPractitionerWithPaper.contact },
      ],
      electronic: [
        {
          email: privatePractitionerWithEmail.email,
          name: privatePractitionerWithEmail.name,
        },
        { email: 'respondentone@example.com', name: 'Respondent One' },
      ],
      paper: [
        contactSecondary,
        { ...irsPractitionerWithPaper, ...irsPractitionerWithPaper.contact },
      ],
    });
  });

  it('should serve all practitioners with an email address electronically', () => {
    mockCase.privatePractitioners = [
      privatePractitionerWithEmail,
      privatePractitionerWithPaper,
    ];
    mockCase.irsPractitioners = [
      irsPractitionerWithPaper,
      irsPractitionerWithEmail,
    ];
    mockCase.petitioners = [];

    const result = aggregatePartiesForService(mockCase);

    expect(result.electronic.length).toEqual(2);
  });

  it('should serve all practitioners without an email address by paper', () => {
    mockCase.privatePractitioners = [
      privatePractitionerWithEmail,
      privatePractitionerWithPaper,
    ];
    mockCase.irsPractitioners = [
      irsPractitionerWithPaper,
      irsPractitionerWithEmail,
    ];
    mockCase.petitioners = [];

    const result = aggregatePartiesForService(mockCase);

    expect(result.paper.length).toEqual(2);
  });

  it('should not serve a party on the case when their serviceIndicator is set to none', () => {
    contactSecondary.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_NONE;
    mockCase.petitioners = [contactPrimary, contactSecondary];

    const result = aggregatePartiesForService(mockCase);

    expect(result.all).not.toContainEqual({
      email: contactSecondary.email,
      name: contactSecondary.name,
    });
    expect(result.paper).not.toContainEqual(contactSecondary);
    expect(result.electronic).not.toContainEqual({
      email: contactSecondary.email,
      name: contactSecondary.name,
    });
  });

  it('should only serve pro se petitioners when "onlyProSePetitioners" is set to true', () => {
    privatePractitionerWithEmail.representing = [contactPrimary.contactId];
    mockCase.privatePractitioners = [privatePractitionerWithEmail];
    contactPrimary.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
    contactSecondary.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_PAPER;
    mockCase.petitioners = [contactPrimary, contactSecondary];

    const result = aggregatePartiesForService(mockCase, {
      onlyProSePetitioners: true,
    });

    expect(result.all).toEqual([contactSecondary]);
    expect(result.electronic).toEqual([]);
    expect(result.paper).toEqual([contactSecondary]);
  });
});
