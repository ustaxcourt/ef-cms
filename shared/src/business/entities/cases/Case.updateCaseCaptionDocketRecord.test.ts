import { CASE_STATUS_TYPES } from '../EntityConstants';
import { Case } from './Case';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('updateCaseCaptionDocketRecord', () => {
  it('should not add a notice of caption changed document when the caption is not set', () => {
    const caseToVerify = new Case(
      {},
      {
        authorizedUser: mockDocketClerkUser,
      },
    ).updateCaseCaptionDocketRecord({
      authorizedUser: mockDocketClerkUser,
    });
    expect(caseToVerify.docketEntries.length).toEqual(0);
  });

  it('should not add a notice of caption changed document when the caption is initially being set', () => {
    const caseToVerify = new Case(
      {
        caseCaption: 'Caption',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    ).updateCaseCaptionDocketRecord({
      authorizedUser: mockDocketClerkUser,
    });
    expect(caseToVerify.docketEntries.length).toEqual(0);
  });

  it('should not add a notice of caption changed document when the caption is equivalent to the initial caption', () => {
    const caseToVerify = new Case(
      {
        caseCaption: 'Caption',
        initialCaption: 'Caption',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    ).updateCaseCaptionDocketRecord({
      authorizedUser: mockDocketClerkUser,
    });
    expect(caseToVerify.docketEntries.length).toEqual(0);
  });

  it('should add a notice of caption changed document with event code MINC when the caption changes from the initial caption', () => {
    const caseToVerify = new Case(
      {
        caseCaption: 'A New Caption',
        initialCaption: 'Caption',
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    ).updateCaseCaptionDocketRecord({
      authorizedUser: mockDocketClerkUser,
    });
    expect(caseToVerify.docketEntries.length).toEqual(1);
    expect(caseToVerify.docketEntries[0].eventCode).toEqual('MINC');
  });

  it('should not add a notice of caption changed document when the caption is equivalent to the last updated caption', () => {
    // Explicit createdAt + docketEntryId so the (createdAt, docketEntryId)
    // sort in Case.ts produces a deterministic chronological order — without
    // them, the constructor assigns "now" + a random UUID and the entries
    // can swap, making the second amendment look earlier than the first.
    const caseToVerify = new Case(
      {
        caseCaption: 'A Very New Caption',
        docketEntries: [
          {
            createdAt: '2020-01-01T00:00:00.000Z',
            docketEntryId: '00000000-0000-0000-0000-000000000001',
            documentTitle:
              "Caption of case is amended from 'Caption v. Commissioner of Internal Revenue, Respondent' to 'A New Caption v. Commissioner of Internal Revenue, Respondent'",
            index: 1,
            isOnDocketRecord: true,
          },
          {
            createdAt: '2020-01-02T00:00:00.000Z',
            docketEntryId: '00000000-0000-0000-0000-000000000002',
            documentTitle:
              "Caption of case is amended from 'A New Caption v. Commissioner of Internal Revenue, Respondent' to 'A Very New Caption v. Commissioner of Internal Revenue, Respondent'",
            index: 2,
            isOnDocketRecord: true,
          },
        ],
        initialCaption: 'Caption',
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    ).updateCaseCaptionDocketRecord({
      authorizedUser: mockDocketClerkUser,
    });
    expect(caseToVerify.docketEntries.length).toEqual(2);
  });

  it('should add a notice of caption changed document when the caption changes from the last updated caption', () => {
    const caseToVerify = new Case(
      {
        caseCaption: 'A Very Berry New Caption',
        docketEntries: [
          {
            createdAt: '2020-01-01T00:00:00.000Z',
            docketEntryId: '00000000-0000-0000-0000-000000000001',
            documentTitle:
              "Caption of case is amended from 'Caption v. Commissioner of Internal Revenue, Respondent' to 'A New Caption v. Commissioner of Internal Revenue, Respondent'",
            index: 1,
            isOnDocketRecord: true,
          },
          {
            createdAt: '2020-01-02T00:00:00.000Z',
            docketEntryId: '00000000-0000-0000-0000-000000000002',
            documentTitle:
              "Caption of case is amended from 'A New Caption v. Commissioner of Internal Revenue, Respondent' to 'A Very New Caption v. Commissioner of Internal Revenue, Respondent'",
            index: 2,
            isOnDocketRecord: true,
          },
        ],
        initialCaption: 'Caption',
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        authorizedUser: mockDocketClerkUser,
      },
    ).updateCaseCaptionDocketRecord({
      authorizedUser: mockDocketClerkUser,
    });
    expect(caseToVerify.docketEntries.length).toEqual(3);
    expect(caseToVerify.docketEntries[2]).toMatchObject({
      index: 3,
      isOnDocketRecord: true,
    });
  });
});
