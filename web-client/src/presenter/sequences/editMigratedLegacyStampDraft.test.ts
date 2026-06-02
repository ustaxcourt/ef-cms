import {
  GRANT_DENY_MOTION_OPTIONS,
  MOTION_DISPOSITIONS,
} from '@shared/business/entities/EntityConstants';
import { translateStampDataToDraftOrderState } from '@shared/business/utilities/translateStampDataToDraftOrderState';
import { setEditGrantDenyMotionFormAction } from '@web-client/presenter/actions/GrantDenyMotion/setEditGrantDenyMotionFormAction';
import { getOrderTypeAction } from '@web-client/presenter/actions/StatusReportOrder/getOrderTypeAction';
import { setDocumentToEditAction } from '@web-client/presenter/actions/setDocumentToEditAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('Grant/Deny edit flow for migrated legacy stamp drafts', () => {
  const docketNumber = '123-26';
  const motionDocketEntryId = 'motion-entry-1';
  const stampedOrderDocketEntryId = 'stamp-order-1';

  const legacyStampData = {
    disposition: MOTION_DISPOSITIONS.GRANTED,
    jurisdictionalOption: 'Jurisdiction is retained by the undersigned',
  };

  const migratedDraftOrderState = translateStampDataToDraftOrderState(
    legacyStampData,
    {
      caseDocketEntries: [
        {
          docketEntryId: motionDocketEntryId,
          documentType: 'Motion for Continuance',
          filingDate: '2025-06-01',
          isDraft: false,
        },
        {
          docketEntryId: stampedOrderDocketEntryId,
          documentTitle: 'Order - Motion for Continuance - GRANTED',
          isDraft: true,
        },
      ],
      documentTitle: 'Order - Motion for Continuance - GRANTED',
      motionDocketEntryId,
      stampedOrderDocketEntryId,
    },
  );

  const stampedDraftEntry = {
    docketEntryId: stampedOrderDocketEntryId,
    documentTitle: 'Order - Motion for Continuance - GRANTED',
    documentType: 'Order',
    draftOrderState: migratedDraftOrderState,
    eventCode: 'O',
    isDraft: true,
    stampData: legacyStampData,
  };

  const caseDetail = {
    docketNumber,
    docketEntries: [stampedDraftEntry],
  };

  const mockIsGrantDenyMotionPath = jest.fn();
  const mockIsStandardOrderPath = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      isGrantDenyMotion: mockIsGrantDenyMotionPath,
      isMotionOrderResponse: jest.fn(),
      isStandardOrder: mockIsStandardOrderPath,
      isStatusReportOrder: jest.fn(),
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('classifies migrated stamp drafts as Grant/Deny orders and hydrates the edit form', async () => {
    await runAction(setDocumentToEditAction, {
      modules: { presenter },
      props: {
        caseDetail,
        docketEntryIdToEdit: stampedOrderDocketEntryId,
      },
    });

    await runAction(getOrderTypeAction, {
      modules: { presenter },
      state: {
        documentToEdit: stampedDraftEntry,
        permissions: {
          STAMP_MOTION: true,
        },
      },
    });

    expect(mockIsGrantDenyMotionPath).toHaveBeenCalled();
    expect(mockIsStandardOrderPath).not.toHaveBeenCalled();

    const editResult = await runAction(setEditGrantDenyMotionFormAction, {
      modules: { presenter },
      props: {
        caseDetail,
        docketEntryIdToEdit: stampedOrderDocketEntryId,
      },
      state: {
        caseDetail,
        documentToEdit: stampedDraftEntry,
      },
    });

    expect(editResult.state.form).toMatchObject({
      disposition: MOTION_DISPOSITIONS.GRANTED,
      jurisdiction: GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.retained,
    });
    expect(editResult.state.docketEntryId).toEqual(motionDocketEntryId);
    expect(editResult.output.path).toEqual(
      `/case-detail/${docketNumber}/documents/${stampedOrderDocketEntryId}/grant-deny-motion-edit`,
    );
  });
});
