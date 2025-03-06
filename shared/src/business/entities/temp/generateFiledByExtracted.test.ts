import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { generateFiledByExtracted } from './generateFiledByExtracted';
import { NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP } from '../EntityConstants';

let mockDocketEntry;

const mockOtherFilingParty: string = 'Bob Barker';
const mockPrimaryContactId: string = '7111b30b-ad38-42c8-9db0-d938cb2cb16b';
const mockSecondaryContactId: string = '55e5129c-ab54-4a9d-a8cf-5a4479ec08b6';
const mockPetitioners = [
  { contactId: mockPrimaryContactId, name: 'Bob' },
  { contactId: mockSecondaryContactId, name: 'Bill' },
];

describe('generateFiledByExtracted', () => {
  beforeEach(() => {
    mockDocketEntry = MOCK_DOCUMENTS[0];
  });

  it('should generate correct filedBy string for a single petitioner in filers', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toEqual('Petr. Bob');
  });

  it('should include the value provided for other filing party when one is provided', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
        otherFilingParty: mockOtherFilingParty,
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toEqual(`Petr. Bob, ${mockOtherFilingParty}`);
  });

  it('should generate correct filedBy string for single petitioner in filers that is not the primary', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: [mockSecondaryContactId],
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toEqual('Petr. Bill');
  });

  it('should include "Resp." in the filedBy text when the respondent is selected as one of the filers', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
        partyIrsPractitioner: true,
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toEqual('Resp. & Petr. Bob');
  });

  it('should generate correct filedBy string for single petitioner in filers, partyIrsPractitioner, and otherFilingParty', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
        otherFilingParty: mockOtherFilingParty,
        partyIrsPractitioner: true,
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toEqual(`Resp. & Petr. Bob, ${mockOtherFilingParty}`);
  });

  it('should generate correct filedBy string for only otherFilingParty', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        otherFilingParty: mockOtherFilingParty,
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toEqual(mockOtherFilingParty);
  });

  it('should generate correct filedBy string for multiple petitioners in filers', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId, mockSecondaryContactId],
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toEqual('Petrs. Bob & Bill');
  });

  it('should generate correct filedBy string for single intervenor in filers', () => {
    const mockIntervenors = mockPetitioners.map(pet => ({
      ...pet,
      contactType: 'intervenor',
    }));
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
      },
      petitioners: mockIntervenors,
    });

    expect(filedByResult).toEqual('Intv. Bob');
  });

  it('should generate correct filedBy string for multiple intervenors in filers', () => {
    const mockIntervenors = mockPetitioners.map(pet => ({
      ...pet,
      contactType: 'intervenor',
    }));
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId, mockSecondaryContactId],
      },
      petitioners: mockIntervenors,
    });

    expect(filedByResult).toEqual('Intvs. Bob & Bill');
  });

  it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner set to false when values are present', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        partyIrsPractitioner: true,
        partyPrivatePractitioner: true,
        privatePractitioners: [
          {
            name: 'Test Practitioner',
            partyPrivatePractitioner: false,
          },
        ],
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toEqual('Resp.');
  });

  it('should not generate a filedBy value when the docket entry is an auto-generated notice of contact change', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        documentType: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP[0].documentType,
        eventCode: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP[0].eventCode,
        filedBy: undefined,
        filers: [mockPrimaryContactId],
        isAutoGenerated: true,
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toBeUndefined();
  });

  it('should generate filed by when the docket entry is a non-auto-generated notice of contact change and is not served', () => {
    const nonNoticeOfContactChangeEventCode: string = 'O';
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        eventCode: nonNoticeOfContactChangeEventCode,
        filers: [mockPrimaryContactId],
        isAutoGenerated: false,
        servedAt: undefined,
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).not.toBeUndefined();
  });

  it('should ignore filers array when the filer is a private practitioner', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
        privatePractitioners: [
          {
            name: 'Bob Practitioner',
            partyPrivatePractitioner: true,
          },
        ],
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toEqual('Bob Practitioner');
  });

  it('should not include private practitioners that are not party private practitioners when there are multiple private practitioners', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
        privatePractitioners: [
          {
            name: 'Bob Practitioner',
            partyPrivatePractitioner: true,
          },
          {
            name: 'Alice Practitioner',
            partyPrivatePractitioner: false,
          },
        ],
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toEqual('Bob Practitioner');
  });

  it('should include otherFilingParty when privatePractitioner is filing and otherFilingPart is included', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        otherFilingParty: 'Other Filing Party',
        filers: [mockPrimaryContactId],
        privatePractitioners: [
          {
            name: 'Bob Practitioner',
            partyPrivatePractitioner: true,
          },
        ],
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toEqual('Bob Practitioner, Other Filing Party');
  });

  it('should not update filedBy when the docket entry has been served', () => {
    const mockFiledBy: string =
      'This filed by should not be updated by the constructor';
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filedBy: mockFiledBy,
        filers: [mockPrimaryContactId],
        servedAt: '2019-08-25T05:00:00.000Z',
        servedParties: 'Test Petitioner',
      },
      petitioners: mockPetitioners,
    });

    expect(filedByResult).toEqual(mockFiledBy);
  });

  it('should include two petitioners from the petitioner array when those two petitioners have the same contaceId', () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
      },
      petitioners: [
        { contactId: mockPrimaryContactId, name: 'Bob' },
        { contactId: mockPrimaryContactId, name: 'Bill' },
      ],
    });

    expect(filedByResult).toEqual('Petrs. Bob & Bill');
  });

  it("should return the passed in docketEntry's filedBy value when none of the filers are a petitioner", () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: ['id that does not match any contact'],
      },
      petitioners: [
        { contactId: mockPrimaryContactId, name: 'Bob' },
        { contactId: mockPrimaryContactId, name: 'Bill' },
      ],
    });

    expect(filedByResult).toEqual(mockDocketEntry.filedBy);
  });

  it("should return the passed in docketEntry's filedBy value when there are not filing parties", () => {
    const filedByResult = generateFiledByExtracted({
      docketEntry: {
        ...mockDocketEntry,
        filers: [],
      },
      petitioners: [],
    });

    expect(filedByResult).toEqual(mockDocketEntry.filedBy);
  });
});
