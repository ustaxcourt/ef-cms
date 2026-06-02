import {
  GRANT_DENY_MOTION_OPTIONS,
  MOTION_DISPOSITIONS,
} from '@shared/business/entities/EntityConstants';
import {
  resolveMotionDocketEntryIdForStampedOrder,
  resolveMotionTypeFromStampedOrderTitle,
  translateStampDataToDraftOrderState,
} from './translateStampDataToDraftOrderState';

describe('translateStampDataToDraftOrderState', () => {
  const legacyStampData = {
    customText: 'Extra clause',
    date: '07/15/26',
    deniedAsMoot: true,
    deniedWithoutPrejudice: false,
    disposition: MOTION_DISPOSITIONS.DENIED,
    dueDateMessage: 'The parties shall file a status report by',
    jurisdictionalOption: 'Jurisdiction is retained by the undersigned',
    strickenFromTrialSession: 'stricken from trial session',
  };

  it('translates legacy stamp form fields and sets grantDenyMotion orderType', () => {
    const result = translateStampDataToDraftOrderState(legacyStampData);

    expect(result).toMatchObject({
      additionalOrderText: ['Extra clause'],
      deniedAsMoot: true,
      deniedWithoutPrejudice: false,
      disposition: MOTION_DISPOSITIONS.DENIED,
      dueDate: '2026-07-15',
      dueDateMessage:
        GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions.statusReport,
      jurisdiction: GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.retained,
      orderType: GRANT_DENY_MOTION_OPTIONS.orderType,
      strickenFromTrialSession: true,
    });
  });

  it('includes previousDocument when motion id is on stamp data', () => {
    const result = translateStampDataToDraftOrderState({
      ...legacyStampData,
      motionDocketEntryId: 'motion-abc',
    });

    expect(result.previousDocument).toEqual({ docketEntryId: 'motion-abc' });
  });

  it('resolves previousDocument from stamped order title and case docket entries', () => {
    const result = translateStampDataToDraftOrderState(legacyStampData, {
      caseDocketEntries: [
        {
          docketEntryId: 'older-motion',
          documentType: 'Motion for Continuance',
          filingDate: '2024-01-01',
          isDraft: false,
        },
        {
          docketEntryId: 'motion-123',
          documentType: 'Motion for Continuance',
          filingDate: '2025-06-01',
          isDraft: false,
        },
      ],
      documentTitle: 'Order - Motion for Continuance - DENIED as moot',
      stampedOrderDocketEntryId: 'stamp-order-1',
    });

    expect(result.previousDocument).toEqual({ docketEntryId: 'motion-123' });
  });

  it('translates restored jurisdiction and status report or stipulated decision due date message', () => {
    const result = translateStampDataToDraftOrderState({
      ...legacyStampData,
      dueDateMessage:
        'The parties shall file a status report or proposed stipulated decision by',
      jurisdictionalOption: 'The case is restored to the general docket',
    });

    expect(result).toMatchObject({
      dueDateMessage:
        GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions
          .statusReportOrStipulatedDecision,
      jurisdiction: GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.restored,
    });
  });

  it('omits null translated values and uses defaults for empty custom text', () => {
    const result = translateStampDataToDraftOrderState({
      customText: '   ',
      date: 'not-a-date',
      dueDateMessage: 'Unknown due date message',
      jurisdictionalOption: 'Unknown jurisdiction',
      strickenFromTrialSession: '   ',
    });

    expect(result).toEqual({
      additionalOrderText: [''],
      orderType: GRANT_DENY_MOTION_OPTIONS.orderType,
    });
  });

  it('translates legacy dates before 1950 and prefers docketEntryId on stamp data', () => {
    const result = translateStampDataToDraftOrderState({
      ...legacyStampData,
      date: '01/02/99',
      docketEntryId: 'motion-from-docket-entry-id',
    });

    expect(result).toMatchObject({
      dueDate: '1999-01-02',
      previousDocument: { docketEntryId: 'motion-from-docket-entry-id' },
    });
  });

  it('uses previousDocumentDocketEntryId from options when case resolution is unavailable', () => {
    const result = translateStampDataToDraftOrderState(legacyStampData, {
      previousDocumentDocketEntryId: 'previous-motion-id',
    });

    expect(result.previousDocument).toEqual({
      docketEntryId: 'previous-motion-id',
    });
  });
});

describe('resolveMotionTypeFromStampedOrderTitle', () => {
  it('extracts the motion document type from legacy stamped order titles', () => {
    expect(
      resolveMotionTypeFromStampedOrderTitle(
        'Order - Motion for Continuance - GRANTED',
      ),
    ).toEqual('Motion for Continuance');

    expect(
      resolveMotionTypeFromStampedOrderTitle(
        'Order - Motion for Continuance - DENIED as moot without prejudice',
      ),
    ).toEqual('Motion for Continuance');
  });

  it('returns undefined when title is missing or does not match', () => {
    expect(resolveMotionTypeFromStampedOrderTitle(undefined)).toBeUndefined();
    expect(resolveMotionTypeFromStampedOrderTitle('')).toBeUndefined();
    expect(
      resolveMotionTypeFromStampedOrderTitle('Unrelated document title'),
    ).toBeUndefined();
  });
});

describe('resolveMotionDocketEntryIdForStampedOrder', () => {
  const caseDocketEntries = [
    {
      docketEntryId: 'stamp-order',
      documentTitle: 'Order - Motion for Continuance - GRANTED',
      isDraft: true,
    },
    {
      docketEntryId: 'motion-entry',
      documentType: 'Motion for Continuance',
      filingDate: '2025-01-15',
      isDraft: false,
    },
  ];

  it('prefers explicit stamp data motion id', () => {
    expect(
      resolveMotionDocketEntryIdForStampedOrder({
        caseDocketEntries,
        documentTitle: caseDocketEntries[0].documentTitle,
        motionDocketEntryIdFromStampData: 'explicit-motion',
        stampedOrderDocketEntryId: 'stamp-order',
      }),
    ).toEqual('explicit-motion');
  });

  it('falls back to title matching when no explicit id exists', () => {
    expect(
      resolveMotionDocketEntryIdForStampedOrder({
        caseDocketEntries,
        documentTitle: caseDocketEntries[0].documentTitle,
        stampedOrderDocketEntryId: 'stamp-order',
      }),
    ).toEqual('motion-entry');
  });

  it('prefers previousDocumentDocketEntryId over title matching', () => {
    expect(
      resolveMotionDocketEntryIdForStampedOrder({
        caseDocketEntries,
        documentTitle: caseDocketEntries[0].documentTitle,
        previousDocumentDocketEntryId: 'previous-motion-id',
        stampedOrderDocketEntryId: 'stamp-order',
      }),
    ).toEqual('previous-motion-id');
  });

  it('matches motion type from freeText when documentTitle is unavailable', () => {
    expect(
      resolveMotionDocketEntryIdForStampedOrder({
        caseDocketEntries,
        freeText: 'Order - Motion for Continuance - GRANTED',
        stampedOrderDocketEntryId: 'stamp-order',
      }),
    ).toEqual('motion-entry');
  });

  it('returns undefined when no motion match exists', () => {
    expect(
      resolveMotionDocketEntryIdForStampedOrder({
        caseDocketEntries,
        documentTitle: 'Order - Motion to Dismiss - GRANTED',
        stampedOrderDocketEntryId: 'stamp-order',
      }),
    ).toBeUndefined();
  });
});
