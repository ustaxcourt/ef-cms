import { DocketEntry } from './DocketEntry';
import { MOCK_DOCUMENTS } from '../../test/mockDocketEntry';
import { NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP } from './EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';

describe('generateFiledBy', () => {
  let mockDocketEntry;

  const mockOtherFilingParty: string = 'Bob Barker';
  const mockPrimaryContactId: string = '7111b30b-ad38-42c8-9db0-d938cb2cb16b';
  const mockSecondaryContactId: string = '55e5129c-ab54-4a9d-a8cf-5a4479ec08b6';
  const mockPetitioners = [
    { contactId: mockPrimaryContactId, name: 'Bob' },
    { contactId: mockSecondaryContactId, name: 'Bill' },
  ];

  beforeEach(() => {
    mockDocketEntry = MOCK_DOCUMENTS[0];
  });

  it('should generate correct filedBy string for single petitioner in filers', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
      },
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toEqual('Petr. Bob');
  });

  it('should include the value provided for other filing party when one is provided', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
        otherFilingParty: mockOtherFilingParty,
      },
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toEqual(`Petr. Bob, ${mockOtherFilingParty}`);
  });

  it('should generate correct filedBy string for single petitioner in filers that is not the primary', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockSecondaryContactId],
      },
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toEqual('Petr. Bill');
  });

  it('should include "Resp." in the filedBy text when the respondent is selected as one of the filers', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
        partyIrsPractitioner: true,
      },
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toEqual('Resp. & Petr. Bob');
  });

  it('should generate correct filedBy string for single petitioner in filers, partyIrsPractitioner, and otherFilingParty', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
        otherFilingParty: mockOtherFilingParty,
        partyIrsPractitioner: true,
      },
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toEqual(
      `Resp. & Petr. Bob, ${mockOtherFilingParty}`,
    );
  });

  it('should generate correct filedBy string for only otherFilingParty', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        otherFilingParty: mockOtherFilingParty,
      },
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toEqual(mockOtherFilingParty);
  });

  it('should generate correct filedBy string for multiple petitioners in filers', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId, mockSecondaryContactId],
      },
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toEqual('Petrs. Bob & Bill');
  });

  it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner (as an object, legacy data)', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        partyIrsPractitioner: true,
        partyPrivatePractitioner: true,
        privatePractitioners: {
          name: 'Test Practitioner',
        },
      },
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toEqual('Resp.');
  });

  it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner set to false', () => {
    const docketEntry = new DocketEntry(
      {
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
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toEqual('Resp.');
  });

  it('should generate correct filedBy string for single petitioner in filers and partyIrsPractitioner in the constructor when values are present', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
        partyIrsPractitioner: true,
      },
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toEqual('Resp. & Petr. Bob');
  });

  it('should generate correct filedBy string for multiple petitioners in filers in the constructor when values are present', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId, mockSecondaryContactId],
      },
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toEqual('Petrs. Bob & Bill');
  });

  it('should generate correct filedBy string for single intervenor in filers', () => {
    const mockIntervenors = mockPetitioners.map(pet => ({
      ...pet,
      contactType: 'intervenor',
    }));
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
      },
      { applicationContext, petitioners: mockIntervenors },
    );
    expect(docketEntry.filedBy).toEqual('Intv. Bob');
  });

  it('should generate correct filedBy string for multiple intervenors in filers', () => {
    const mockIntervenors = mockPetitioners.map(pet => ({
      ...pet,
      contactType: 'intervenor',
    }));
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId, mockSecondaryContactId],
      },
      { applicationContext, petitioners: mockIntervenors },
    );
    expect(docketEntry.filedBy).toEqual('Intvs. Bob & Bill');
  });

  it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner set to false in the constructor when values are present', () => {
    const docketEntry = new DocketEntry(
      {
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
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toEqual('Resp.');
  });

  it('should not generate a filedBy value when the docket entry is an auto-generated notice of contact change', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        documentType: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP[0].documentType,
        eventCode: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP[0].eventCode,
        filedBy: undefined,
        filers: [mockPrimaryContactId],
        isAutoGenerated: true,
      },
      { applicationContext, petitioners: mockPetitioners },
    );

    expect(docketEntry.filedBy).toBeUndefined();
  });

  it('should generate filed by when the docket entry is a non-auto-generated notice of contact change and is not served', () => {
    const nonNoticeOfContactChangeEventCode: string = 'O';
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        eventCode: nonNoticeOfContactChangeEventCode,
        filers: [mockPrimaryContactId],
        isAutoGenerated: false,
        servedAt: undefined,
      },
      {
        applicationContext,
        petitioners: mockPetitioners,
      },
    );

    expect(docketEntry.filedBy).not.toBeUndefined();
  });

  it('should ignore filers array when the filer is a private practitioner', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryContactId],
        privatePractitioners: [
          {
            name: 'Bob Practitioner',
            partyPrivatePractitioner: true,
          },
        ],
      },
      {
        applicationContext,
        petitioners: mockPetitioners,
      },
    );

    expect(docketEntry.filedBy).toEqual('Bob Practitioner');
  });

  it('should not update filedBy when the docket entry has been served', () => {
    const mockFiledBy: string =
      'This filed by should not be updated by the constructor';
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filedBy: mockFiledBy,
        filers: [mockPrimaryContactId],
        servedAt: '2019-08-25T05:00:00.000Z',
        servedParties: 'Test Petitioner',
      },
      {
        applicationContext,
        petitioners: mockPetitioners,
      },
    );

    expect(docketEntry.filedBy).toEqual(mockFiledBy);
  });
});
