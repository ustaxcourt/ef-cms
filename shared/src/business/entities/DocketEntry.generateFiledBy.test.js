const {
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP,
} = require('./EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');

describe('generateFiledBy (called in constructor)', () => {
  const mockDocketEntry = MOCK_DOCUMENTS[0];
  const mockPrimaryId = '7111b30b-ad38-42c8-9db0-d938cb2cb16b';
  const mockSecondaryId = '55e5129c-ab54-4a9d-a8cf-5a4479ec08b6';
  const petitioners = [
    { contactId: mockPrimaryId, name: 'Bob' },
    { contactId: mockSecondaryId, name: 'Bill' },
  ];

  it('should generate correct filedBy string for single petitioner in filers', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryId],
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Petr. Bob');
  });

  it('should generate correct filedBy string for single petitioner in filers and otherFilingParty', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryId],
        otherFilingParty: 'Bob Barker',
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Petr. Bob, Bob Barker');
  });

  it('should generate correct filedBy string for single petitioner in filers that is not the primary', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockSecondaryId],
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Petr. Bill');
  });

  it('should generate correct filedBy string for single petitioner in filers and partyIrsPractitioner', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryId],
        partyIrsPractitioner: true,
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Resp. & Petr. Bob');
  });

  it('should generate correct filedBy string for single petitioner in filers, partyIrsPractitioner, and otherFilingParty', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryId],
        otherFilingParty: 'Bob Barker',
        partyIrsPractitioner: true,
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Resp. & Petr. Bob, Bob Barker');
  });

  it('should generate correct filedBy string for only otherFilingParty', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        otherFilingParty: 'Bob Barker',
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Bob Barker');
  });

  it('should generate correct filedBy string for multiple petitioners in filers', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryId, mockSecondaryId],
      },
      { applicationContext, petitioners },
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
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Resp.');
  });

  it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        partyIrsPractitioner: true,
        partyPrivatePractitioner: true,
        privatePractitioners: [
          {
            name: 'Test Practitioner',
            partyPrivatePractitioner: true,
          },
        ],
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Resp. & Counsel Test Practitioner');
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
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Resp.');
  });

  it('should generate correct filedBy string for partyIrsPractitioner and multiple partyPrivatePractitioners', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        partyIrsPractitioner: true,
        partyPrivatePractitioner: true,
        privatePractitioners: [
          {
            name: 'Test Practitioner',
            partyPrivatePractitioner: true,
          },
          {
            name: 'Test Practitioner1',
            partyPrivatePractitioner: true,
          },
        ],
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual(
      'Resp. & Counsel Test Practitioner & Counsel Test Practitioner1',
    );
  });

  it('should generate correct filedBy string for partyIrsPractitioner and multiple partyPrivatePractitioners with one set to false', () => {
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
          {
            name: 'Test Practitioner1',
            partyPrivatePractitioner: true,
          },
        ],
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Resp. & Counsel Test Practitioner1');
  });

  it('should generate correct filedBy string for single petitioner in filers and partyIrsPractitioner in the constructor when values are present', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryId],
        partyIrsPractitioner: true,
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Resp. & Petr. Bob');
  });

  it('should generate correct filedBy string for multiple petitioners in filers in the constructor when values are present', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryId, mockSecondaryId],
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Petrs. Bob & Bill');
  });

  it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner in the constructor when values are present', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        partyIrsPractitioner: true,
        partyPrivatePractitioner: true,
        privatePractitioners: [
          {
            name: 'Test Practitioner',
            partyPrivatePractitioner: true,
          },
        ],
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Resp. & Counsel Test Practitioner');
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
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Resp.');
  });

  it('should generate correct filedBy string for partyIrsPractitioner and multiple partyPrivatePractitioners in the constructor when values are present', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        partyIrsPractitioner: true,
        partyPrivatePractitioner: true,
        privatePractitioners: [
          {
            name: 'Test Practitioner',
            partyPrivatePractitioner: true,
          },
          {
            name: 'Test Practitioner1',
            partyPrivatePractitioner: true,
          },
        ],
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual(
      'Resp. & Counsel Test Practitioner & Counsel Test Practitioner1',
    );
  });

  it('should generate correct filedBy string for partyIrsPractitioner and multiple partyPrivatePractitioners with one set to false in the constructor when values are present', () => {
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
          {
            name: 'Test Practitioner1',
            partyPrivatePractitioner: true,
          },
        ],
      },
      { applicationContext, petitioners },
    );
    expect(docketEntry.filedBy).toEqual('Resp. & Counsel Test Practitioner1');
  });

  it('should set filedBy to undefined when the docket entry is an auto-generated notice of contact change', () => {
    const mockDocketEntryNoFiledBy = {
      ...mockDocketEntry,
      filedBy: undefined,
    };
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntryNoFiledBy,
        documentType: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP[0].documentType,
        eventCode: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP[0].eventCode,
        filers: [mockPrimaryId],
        isAutoGenerated: true,
        isMinuteEntry: false,
        isOnDocketRecord: true,
        privatePractitioners: [
          { name: 'Bob Practitioner', partyPrivatePractitioner: true },
        ],
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      },
      { applicationContext },
    );

    expect(docketEntry.filedBy).toBeUndefined();
  });

  it('should generate filed by when the docket entry is a non-auto-generated notice of contact change', () => {
    const docketEntry = new DocketEntry(
      {
        ...mockDocketEntry,
        filers: [mockPrimaryId],
        privatePractitioners: [
          { name: 'Bob Practitioner', partyPrivatePractitioner: true },
        ],
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      },
      {
        applicationContext,
        petitioners: [{ contactId: mockPrimaryId, name: 'Bill Petitioner' }],
      },
    );

    expect(docketEntry.filedBy).toEqual(
      'Counsel Bob Practitioner & Petr. Bill Petitioner',
    );
  });
});
