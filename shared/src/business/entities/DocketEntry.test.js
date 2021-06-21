const {
  DOCUMENT_RELATIONSHIPS,
  INITIAL_DOCUMENT_TYPES,
  ROLES,
} = require('./EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

export const mockPrimaryId = '7111b30b-ad38-42c8-9db0-d938cb2cb16b';
export const mockSecondaryId = '55e5129c-ab54-4a9d-a8cf-5a4479ec08b6';

export const A_VALID_DOCKET_ENTRY = {
  createdAt: '2020-07-17T19:28:29.675Z',
  docketEntryId: '0f5e035c-efa8-49e4-ba69-daf8a166a98f',
  docketNumber: '101-21',
  documentType: 'Petition',
  eventCode: 'A',
  filedBy: 'Test Petitioner',
  filers: [mockPrimaryId],
  receivedAt: '2020-07-17T19:28:29.675Z',
  role: ROLES.petitioner,
  userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
};

export const MOCK_PETITIONERS = [
  { contactId: mockPrimaryId, name: 'Bob' },
  { contactId: mockSecondaryId, name: 'Bill' },
];

describe('DocketEntry entity', () => {
  describe('generateFiledBy', () => {
    it('should update filedBy when the docket entry has not been served', () => {
      const myDoc = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          filers: [mockPrimaryId, mockSecondaryId],
          isLegacyServed: undefined,
          servedAt: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(myDoc.filedBy).toEqual(
        `Petrs. ${MOCK_PETITIONERS[0].name} & ${MOCK_PETITIONERS[1].name}`,
      );
    });

    it('should not update filedBy when the docket entry has been served', () => {
      const mockFiledBy =
        'This filed by should not be updated by the constructor';
      const myDoc = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          filedBy: mockFiledBy,
          filers: [mockPrimaryId, mockSecondaryId],
          isLegacyServed: undefined,
          servedAt: '2019-08-25T05:00:00.000Z',
          servedParties: 'Test Petitioner',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(myDoc.filedBy).toEqual(mockFiledBy);
    });
  });

  describe('signedAt', () => {
    it('should implicitly set a signedAt for Notice event codes', () => {
      const myDoc = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          eventCode: 'NOT',
          signedAt: null,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(myDoc.signedAt).toBeTruthy();
    });

    it('should not change an already signedAt Notice', () => {
      const myDoc = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          eventCode: 'NOT',
          signedAt: '2019-08-25T05:00:00.000Z',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(myDoc.signedAt).toEqual('2019-08-25T05:00:00.000Z');
    });

    it('should NOT implicitly set a signedAt for non Notice event codes', () => {
      const myDoc = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          eventCode: 'O',
          signedAt: null,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(myDoc.signedAt).toEqual(null);
    });
  });

  describe('isDraft', () => {
    it('should default to false when no isDraft value is provided', () => {
      const myDoc = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          eventCode: 'NOT',
          signedAt: null,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(myDoc.isDraft).toBe(false);
    });
  });

  describe('isValid', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new DocketEntry({}, {})).toThrow();
    });

    it('Creates a valid docket entry', () => {
      const myDoc = new DocketEntry(A_VALID_DOCKET_ENTRY, {
        applicationContext,
        petitioners: MOCK_PETITIONERS,
      });
      myDoc.docketEntryId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
      expect(myDoc.isValid()).toBeTruthy();
      expect(myDoc.entityName).toEqual('DocketEntry');
    });

    it('Creates an invalid docket entry with no document type', () => {
      const myDoc = new DocketEntry(
        {
          userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(myDoc.isValid()).toBeFalsy();
    });

    it('Creates an invalid docket entry with no userId', () => {
      const myDoc = new DocketEntry(
        {
          documentType: 'Petition',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(myDoc.isValid()).toBeFalsy();
    });

    it('Creates an invalid docket entry with serviceDate of undefined-undefined-undefined', () => {
      const myDoc = new DocketEntry(
        {
          serviceDate: 'undefined-undefined-undefined',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(myDoc.isValid()).toBeFalsy();
    });
  });

  describe('unsignDocument', () => {
    it('signs and unsigns the document', () => {
      const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
        applicationContext,
        petitioners: MOCK_PETITIONERS,
      });
      docketEntry.setSigned('abc-123', 'Joe Exotic');

      expect(docketEntry.signedByUserId).toEqual('abc-123');
      expect(docketEntry.signedJudgeName).toEqual('Joe Exotic');
      expect(docketEntry.signedAt).toBeDefined();

      docketEntry.unsignDocument();

      expect(docketEntry.signedByUserId).toEqual(null);
      expect(docketEntry.signedJudgeName).toEqual(null);
      expect(docketEntry.signedAt).toEqual(null);
    });
  });

  describe('secondaryDocument validation', () => {
    it('should not set value of secondaryDocument if the scenario is not Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          scenario: 'Standard',
          secondaryDocument: {},
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(createdDocketEntry.secondaryDocument).toBeUndefined();
      expect(createdDocketEntry.isValid()).toEqual(true);
    });

    it('should not be valid if secondaryDocument is present and the scenario is not Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          scenario: 'Standard',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      createdDocketEntry.secondaryDocument = {
        secondaryDocumentInfo: 'was set by accessor rather than init',
      };
      expect(createdDocketEntry.isValid()).toEqual(false);
      expect(
        Object.keys(createdDocketEntry.getFormattedValidationErrors()),
      ).toEqual([DOCUMENT_RELATIONSHIPS.SECONDARY]);
    });

    it('should be valid if secondaryDocument is undefined and the scenario is not Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          scenario: 'Standard',
          secondaryDocument: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(createdDocketEntry.isValid()).toEqual(true);
    });

    it('should be valid if secondaryDocument is not present and the scenario is Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          scenario: 'Nonstandard H',
          secondaryDocument: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(createdDocketEntry.isValid()).toEqual(true);
    });

    it('should be valid if secondaryDocument is present and its contents are valid and the scenario is Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          scenario: 'Nonstandard H',
          secondaryDocument: {
            documentTitle: 'Petition',
            documentType: 'Petition',
            eventCode: 'P',
          },
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(createdDocketEntry.isValid()).toEqual(true);
    });

    it('should not be valid if secondaryDocument is present and it is missing fields and the scenario is Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          scenario: 'Nonstandard H',
          secondaryDocument: {},
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(createdDocketEntry.isValid()).toEqual(false);
      expect(
        Object.keys(createdDocketEntry.getFormattedValidationErrors()),
      ).toEqual(['documentType', 'eventCode']);
    });

    it('should filter out unnecessary values from servedParties', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          docketEntryId: applicationContext.getUniqueId(),
          servedAt: applicationContext.getUtilities().createISODateString(),
          servedParties: [
            {
              email: 'me@example.com',
              extra: 'extra',
              name: 'me',
              role: 'irsSuperuser',
            },
          ],
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(createdDocketEntry.isValid()).toEqual(true);
      expect(createdDocketEntry.servedParties).toEqual([
        {
          email: 'me@example.com',
          name: 'me',
          role: 'irsSuperuser',
        },
      ]);
    });

    it('should return an error when servedParties is not an array', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          docketEntryId: applicationContext.getUniqueId(),
          servedAt: applicationContext.getUtilities().createISODateString(),
          servedParties: {
            email: 'me@example.com',
            extra: 'extra',
            name: 'me',
            role: 'irsSuperuser',
          },
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(createdDocketEntry.isValid()).toEqual(false);
      expect(createdDocketEntry.getFormattedValidationErrors()).toEqual({
        servedParties: '"servedParties" must be an array',
      });
    });
  });

  describe('minute entries', () => {
    it('creates minute entry', () => {
      const docketEntry = new DocketEntry(
        {
          docketNumber: '101-21',
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBe(true);
      expect(docketEntry.isMinuteEntry).toBe(true);
    });
  });

  describe('judgeUserId', () => {
    it('sets the judgeUserId property when a value is passed in', () => {
      const mockJudgeUserId = 'f5aa0760-9fee-4a58-9658-d043b01f2fb0';
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          judgeUserId: mockJudgeUserId,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry).toMatchObject({
        judgeUserId: mockJudgeUserId,
      });
      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('does not fail validation without a judgeUserId', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          judgeUserId: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(docketEntry.judgeUserId).toBeUndefined();
      expect(docketEntry.isValid()).toBeTruthy();
    });
  });
});
