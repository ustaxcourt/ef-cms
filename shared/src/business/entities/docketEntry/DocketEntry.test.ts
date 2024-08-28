import {
  DOCUMENT_RELATIONSHIPS,
  INITIAL_DOCUMENT_TYPES,
  ROLES,
} from '../EntityConstants';
import { DocketEntry } from './DocketEntry';
import { MOCK_WORK_ITEM } from '@shared/test/mockWorkItem';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

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
          isOnDocketRecord: true,
          userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBe(true);
      expect(DocketEntry.isMinuteEntry(docketEntry)).toBe(true);
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

  describe('Internal Users', () => {
    it('should show fields for internal users', () => {
      const docketEntry = {
        ...A_VALID_DOCKET_ENTRY,
        draftOrderState: {},
        editState: 'editing',
        isDraft: false,
        judge: 'Buch',
        judgeUserId: '5c9685be-6cbc-4c00-bf26-c2b59f31a0d7',
        pending: false,
        previousDocument: {
          docketEntryId: '6adff7fc-ba8d-4f32-89b5-18f340b22b6e',
          documentTitle: 'Hello',
          documentType: 'O',
        },
        qcAt: '2023-11-21T20:49:28.192Z',
        qcByUserId: '196d8891-9863-4530-af23-e385e6bf071c',
        signedAt: '2022-10-21T20:49:28.192Z',
        signedByUserId: '384906db-2f1d-4fdf-941e-41fe800e14db',
        signedJudgeName: 'Buch',
        signedJudgeUserId: '5c9685be-6cbc-4c00-bf26-c2b59f31a0d7',
        stampData: {},
        strickenBy: 'Talon',
        strickenByUserId: '3c620b4a-e12b-47b7-835c-1d873401f732',
        userId: 'a9ea9ac7-ebd4-43d6-9d40-d21a3cfd71f7',
        workItem: MOCK_WORK_ITEM,
      };

      const docketEntryEntity = new DocketEntry(docketEntry, {
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        filtered: true,
        petitioners: MOCK_PETITIONERS,
      });

      expect(docketEntryEntity.draftOrderState).toEqual(
        docketEntry.draftOrderState,
      );
      expect(docketEntryEntity.editState).toEqual(docketEntry.editState);
      expect(docketEntryEntity.isDraft).toEqual(docketEntry.isDraft);
      expect(docketEntryEntity.judge).toEqual(docketEntry.judge);
      expect(docketEntryEntity.judgeUserId).toEqual(docketEntry.judgeUserId);
      expect(docketEntryEntity.pending).toEqual(docketEntry.pending);
      expect(docketEntryEntity.previousDocument).toEqual(
        docketEntry.previousDocument,
      );
      expect(docketEntryEntity.qcAt).toEqual(docketEntry.qcAt);
      expect(docketEntryEntity.qcByUserId).toEqual(docketEntry.qcByUserId);
      expect(docketEntryEntity.signedAt).toEqual(docketEntry.signedAt);
      expect(docketEntryEntity.signedByUserId).toEqual(
        docketEntry.signedByUserId,
      );
      expect(docketEntryEntity.signedJudgeName).toEqual(
        docketEntry.signedJudgeName,
      );
      expect(docketEntryEntity.signedJudgeUserId).toEqual(
        docketEntry.signedJudgeUserId,
      );
      expect(docketEntryEntity.stampData).toEqual(docketEntry.stampData);
      expect(docketEntryEntity.strickenBy).toEqual(docketEntry.strickenBy);
      expect(docketEntryEntity.strickenByUserId).toEqual(
        docketEntry.strickenByUserId,
      );
      expect(docketEntryEntity.userId).toEqual(docketEntry.userId);
      expect(docketEntryEntity.workItem).toEqual(
        new WorkItem(docketEntry.workItem, { applicationContext }),
      );
    });

    it('should show fields for internal users', () => {
      const docketEntry = {
        ...A_VALID_DOCKET_ENTRY,
        draftOrderState: {},
        editState: 'editing',
        isDraft: false,
        judge: 'Buch',
        judgeUserId: '5c9685be-6cbc-4c00-bf26-c2b59f31a0d7',
        pending: false,
        previousDocument: {
          docketEntryId: '6adff7fc-ba8d-4f32-89b5-18f340b22b6e',
          documentTitle: 'Hello',
          documentType: 'O',
        },
        qcAt: '2023-11-21T20:49:28.192Z',
        qcByUserId: '196d8891-9863-4530-af23-e385e6bf071c',
        signedAt: '2022-10-21T20:49:28.192Z',
        signedByUserId: '384906db-2f1d-4fdf-941e-41fe800e14db',
        signedJudgeName: 'Buch',
        signedJudgeUserId: '5c9685be-6cbc-4c00-bf26-c2b59f31a0d7',
        stampData: {},
        strickenBy: 'Talon',
        strickenByUserId: '3c620b4a-e12b-47b7-835c-1d873401f732',
        userId: 'a9ea9ac7-ebd4-43d6-9d40-d21a3cfd71f7',
        workItem: MOCK_WORK_ITEM,
      };

      const docketEntryEntity = new DocketEntry(docketEntry, {
        applicationContext,
        authorizedUser: mockPetitionerUser,
        filtered: true,
        petitioners: MOCK_PETITIONERS,
      });

      expect(docketEntryEntity.draftOrderState).toBeFalsy();
      expect(docketEntryEntity.editState).toBeFalsy();
      expect(docketEntryEntity.isDraft).toBeFalsy();
      expect(docketEntryEntity.judge).toBeFalsy();
      expect(docketEntryEntity.judgeUserId).toBeFalsy();
      expect(docketEntryEntity.pending).toBeFalsy();
      expect(docketEntryEntity.previousDocument).toBeFalsy();
      expect(docketEntryEntity.qcAt).toBeFalsy();
      expect(docketEntryEntity.qcByUserId).toBeFalsy();
      expect(docketEntryEntity.signedAt).toBeFalsy();
      expect(docketEntryEntity.signedByUserId).toBeFalsy();
      expect(docketEntryEntity.signedJudgeName).toBeFalsy();
      expect(docketEntryEntity.signedJudgeUserId).toBeFalsy();
      expect(docketEntryEntity.stampData).toBeFalsy();
      expect(docketEntryEntity.strickenBy).toBeFalsy();
      expect(docketEntryEntity.strickenByUserId).toBeFalsy();
      expect(docketEntryEntity.userId).toBeFalsy();
      expect(docketEntryEntity.workItem).toBeFalsy();
    });
  });
});
