import {
  DOCUMENT_RELATIONSHIPS,
  INITIAL_DOCUMENT_TYPES,
  ROLES,
} from './EntityConstants';
import { DocketEntry } from './DocketEntry';
import { applicationContext } from '../test/createTestApplicationContext';

export const mockPrimaryId = '7111b30b-ad38-42c8-9db0-d938cb2cb16b';
export const mockSecondaryId = '55e5129c-ab54-4a9d-a8cf-5a4479ec08b6';

export const A_VALID_DOCKET_ENTRY = {
  createdAt: '2020-07-17T19:28:29.675Z',
  docketEntryId: '0f5e035c-efa8-49e4-ba69-daf8a166a98f',
  docketNumber: '101-21',
  documentType: 'Petition',
  eventCode: 'A',
  filedBy: 'Test Petitioner',
  filedByRole: ROLES.petitioner,
  filers: [mockPrimaryId],
  receivedAt: '2020-07-17T19:28:29.675Z',
  userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
};

export const MOCK_PETITIONERS = [
  { contactId: mockPrimaryId, name: 'Bob' },
  { contactId: mockSecondaryId, name: 'Bill' },
];

describe('DocketEntry entity', () => {
  it('defaults stampData to an empty object when no stamp data is passed in', () => {
    const entry = new DocketEntry(
      { ...A_VALID_DOCKET_ENTRY, stampData: undefined },
      {
        applicationContext,
        petitioners: MOCK_PETITIONERS,
      },
    );

    expect(entry.stampData).toEqual({});
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

      expect(docketEntry.signedByUserId).toBeUndefined();
      expect(docketEntry.signedJudgeName).toBeUndefined();
      expect(docketEntry.signedAt).toBeUndefined();
    });
  });

  describe('filers array validation', () => {
    it('is valid when the docket entry has been served and the filers array contains a non-GUID value', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          filers: ['Manually edited filers for served docket entry'],
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
    });

    it('is valid when the docket entry has not been served and the filers array only contains elements that are GUIDs', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          filers: [
            '639c7b5a-a314-4094-bfeb-714161eea59a',
            '26c2ebb3-8297-4dbc-971a-2cc45febcb9c',
          ],
          servedAt: undefined,
          servedParties: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(createdDocketEntry.isValid()).toEqual(true);
    });

    it('is invalid when the docket entry has not been served and the filers array contains elements that are non-GUID values', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          filers: ['639c7b5a-a314-4094-bfeb-714161eea59a', 'Not a guid'],
          servedAt: undefined,
          servedParties: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(createdDocketEntry.getFormattedValidationErrors()).toEqual({
        'filers[1]': '"filers[1]" must be a valid GUID',
      });
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
        Object.keys(createdDocketEntry.getFormattedValidationErrors()!),
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
        Object.keys(
          createdDocketEntry.getFormattedValidationErrors() as object,
        ),
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
          filedByRole: ROLES.petitioner,
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

  describe('eventCode', () => {
    it('when isDraft is true, the eventCode should be optional (thus allowing undefined)', () => {
      const mockJudgeUserId = 'f5aa0760-9fee-4a58-9658-d043b01f2fb0';
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          eventCode: undefined,
          isDraft: true,
          judgeUserId: mockJudgeUserId,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('when isDraft is true, the eventCode should be optional (thus allowing null)', () => {
      const mockJudgeUserId = 'f5aa0760-9fee-4a58-9658-d043b01f2fb0';
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          eventCode: null,
          isDraft: true,
          judgeUserId: mockJudgeUserId,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('eventCode should be required if isDraft is false', () => {
      const mockJudgeUserId = 'f5aa0760-9fee-4a58-9658-d043b01f2fb0';
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          eventCode: null,
          isDraft: false,
          judgeUserId: mockJudgeUserId,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeFalsy();
    });
  });

  describe('documentType', () => {
    it('when isDraft is true, the documentType should be optional (thus allowing undefined)', () => {
      const mockJudgeUserId = 'f5aa0760-9fee-4a58-9658-d043b01f2fb0';
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: undefined,
          isDraft: true,
          judgeUserId: mockJudgeUserId,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('when isDraft is true, the documentType should be optional (thus allowing null)', () => {
      const mockJudgeUserId = 'f5aa0760-9fee-4a58-9658-d043b01f2fb0';
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: null,
          isDraft: true,
          judgeUserId: mockJudgeUserId,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('documentType should be required if isDraft is false', () => {
      const mockJudgeUserId = 'f5aa0760-9fee-4a58-9658-d043b01f2fb0';
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: null,
          isDraft: false,
          judgeUserId: mockJudgeUserId,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeFalsy();
    });
  });

  describe('judge', () => {
    it('judge should be optional when documentType is undefined', () => {
      const mockJudgeUserId = 'f5aa0760-9fee-4a58-9658-d043b01f2fb0';
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: undefined,
          eventCode: undefined,
          isDraft: true,
          judgeUserId: mockJudgeUserId,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(docketEntry.isValid()).toBeTruthy();
    });
  });
});
