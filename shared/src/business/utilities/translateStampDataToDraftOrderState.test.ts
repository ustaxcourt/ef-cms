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
});
