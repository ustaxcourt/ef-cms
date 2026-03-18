/* eslint-disable max-lines */
import {
  BRIEF_EVENTCODES,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  MOTION_DISPOSITIONS,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ROLES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  UNSERVABLE_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { cloneDeep } from 'lodash';
import {
  docketClerk1User,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import {
  type FormattedDocketEntry,
  getFormattedDocketEntry,
  getShowEditDocketRecordEntry,
  getShowSealDocketRecordEntry,
  isSelectableForDownload,
  setupIconsToDisplay,
} from './formattedDocketEntries';
import { simpleDocketEntries } from '@web-client/presenter/computeds/mockFormattedCaseDetailTestFixtures';
import { runCompute } from 'cerebral/test';
import { type Get } from 'cerebral';
import { FormattedCaseDetailDocketEntry } from '@shared/business/utilities/getFormattedCaseDetail';

let mockIsNotServedDocument;
jest.mock('@shared/business/utilities/getFormattedCaseDetail', () => ({
  computeIsNotServedDocument: jest
    .fn()
    .mockImplementation(() => mockIsNotServedDocument),
}));

describe('getFormattedDocketEntry', () => {
  let simpleDocketEntry;
  let mockCase;
  let baseParams;

  const { DOCUMENT_PROCESSING_STATUS_OPTIONS } =
    applicationContext.getConstants();

  const rootDocument = {
    docketEntryId: '743595eb-e3e2-4308-859d-e4215fe8b706',
    documentType: 'Petition',
    eventCode: 'P',
  };

  // some of these values are computed in getFormattedCaseDetail and
  // sent in to formattedCaseDetail
  const servedCourtIssuedDocketEntry = {
    ...simpleDocketEntry,
    archived: false,
    createdAt: '2019-02-28T21:14:39.488Z',
    eventCode: 'O',
    isCourtIssuedDocument: true,
    isDraft: false,
    isFileAttached: true,
    isOnDocketRecord: true,
    processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    qcWorkItemsCompleted: true,
    servedAt: '2019-02-28T21:14:39.488Z',
  };

  type preformattedDocketEntry = Omit<
    FormattedDocketEntry,
    'descriptionDisplay' | 'iconsToDisplay' | 'toolTipText'
  >;

  beforeEach(() => {
    mockIsNotServedDocument = false;
    mockCase = cloneDeep(MOCK_CASE);
    baseParams = {
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
      entry: simpleDocketEntry,
      formattedCase: {
        ...MOCK_CASE,
        filedByRole: ROLES.privatePractitioner,
      },
      permissions: {},
      rawCase: mockCase,
      user: docketClerk1User,
      visibilityPolicyDateFormatted: '',
    };

    simpleDocketEntry = {
      ...simpleDocketEntries[0],
      rootDocument,
    };
  });

  describe('showLoadingIcon', () => {
    it('should be true if isExternalUser is false, permissions.UPDATE_CASE is false, and entry.processingStatus is not complete', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
          },
          permissions: { UPDATE_CASE: false },
          user: docketClerk1User,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showLoadingIcon).toBeTruthy();
    });

    it('should be false if isExternalUser is false, permissions.UPDATE_CASE is true, and entry.processingStatus is not complete', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
          },
          permissions: { UPDATE_CASE: true },
          user: docketClerk1User,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showLoadingIcon).toBeFalsy();
    });

    it('should be false if isExternalUser is false, permissions.UPDATE_CASE is false, and entry.processingStatus is complete', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          },
          permissions: { UPDATE_CASE: false },
          user: docketClerk1User,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showLoadingIcon).toBeFalsy();
    });

    it('should be false if isExternalUser is true', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
          },
          permissions: { UPDATE_CASE: false },
          user: privatePractitionerUser,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showLoadingIcon).toBeFalsy();
    });
  });

  describe('isPaper', () => {
    it('should be true if isInProgress is false, qcWorkItemsUntouched is false, and isPaper is true', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isInProgress: false,
            isPaper: true,
            qcWorkItemsUntouched: false,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.isPaper).toBeTruthy();
    });

    it('should be false if isInProgress is false, qcWorkItemsUntouched is false, and isPaper is false', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isInProgress: false,
            isPaper: false,
            qcWorkItemsUntouched: false,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.isPaper).toBeFalsy();
    });

    it('should be false if isInProgress is true, qcWorkItemsUntouched is false, and isPaper is true', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isInProgress: true,
            isPaper: true,
            qcWorkItemsUntouched: false,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.isPaper).toBeFalsy();
    });

    it('should be false if isInProgress is false, qcWorkItemsUntouched is true, and isPaper is true', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isInProgress: false,
            isPaper: true,
            qcWorkItemsUntouched: true,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.isPaper).toBeFalsy();
    });
  });

  describe('descriptionDisplay', () => {
    it('should call getDescriptionDisplay and return only documentTitle with no other information', () => {
      const expectedDescriptionDisplay = 'Answer';
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            additionalInfo: undefined,
            documentTitle: 'Answer',
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(
        applicationContext.getUtilities().getDescriptionDisplay,
      ).toHaveBeenCalled();
      expect(result.descriptionDisplay).toEqual(expectedDescriptionDisplay);
    });

    it('should call getDescriptionDisplay if entry.documentTitle is set and return its result using document title and additional info', () => {
      const additionalInfo = 'With Extra Things';

      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            addToCoversheet: true,
            additionalInfo,
            documentTitle: 'Answer',
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(
        applicationContext.getUtilities().getDescriptionDisplay,
      ).toHaveBeenCalled();
      expect(result.descriptionDisplay).toEqual('Answer With Extra Things');
    });

    it('should not call getDescriptionDisplay or set descriptionDisplay on result if entry.documentTitle is undefined', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            documentTitle: undefined,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(
        applicationContext.getUtilities().getDescriptionDisplay,
      ).not.toHaveBeenCalled();
      expect(result.descriptionDisplay).toBeFalsy();
    });
  });

  describe('showDocumentProcessing', () => {
    it('should be true if permissions.UPDATE_CASE is false and entry.processingStatus is not complete', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
          },

          permissions: { UPDATE_CASE: false },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showDocumentProcessing).toBeTruthy();
    });

    it('should be false if permissions.UPDATE_CASE is false and entry.processingStatus is complete', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          },

          permissions: { UPDATE_CASE: false },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showDocumentProcessing).toBeFalsy();
    });

    it('should be false if permissions.UPDATE_CASE is true and entry.processingStatus is not complete', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
          },

          permissions: { UPDATE_CASE: true },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showDocumentProcessing).toBeFalsy();
    });
  });

  describe('showNotServed', () => {
    it('should be true if computeIsNotServedDocument returns true', () => {
      mockIsNotServedDocument = true;
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: simpleDocketEntry,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showNotServed).toBeTruthy();
    });

    it('should be false if computeIsNotServedDocument returns false', () => {
      mockIsNotServedDocument = false;
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: simpleDocketEntry,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showNotServed).toBeFalsy();
    });
  });

  describe('showServed', () => {
    it('should be true if entry.isStatusServed is true', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isStatusServed: true,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showServed).toBeTruthy();
    });

    it('should be false if entry.isStatusServed is false', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isStatusServed: false,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showServed).toBeFalsy();
    });
  });

  describe('showDocumentViewerLink', () => {
    it('should be true if isExternalUser is false and document links are shown', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...servedCourtIssuedDocketEntry,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showDocumentViewerLink).toBeTruthy();
    });

    it('should be false if isExternalUser is false and document links are not shown', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showDocumentViewerLink).toBeFalsy();
    });

    it('should be false if isExternalUser is true', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...servedCourtIssuedDocketEntry,
          },
          user: privatePractitionerUser,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showDocumentViewerLink).toBeFalsy();
    });
  });

  describe('showLinkToDocument', () => {
    it('should be true if isExternalUser is true and document links are shown', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...servedCourtIssuedDocketEntry,
          },
          user: privatePractitionerUser,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showLinkToDocument).toBeTruthy();
    });

    it('should be false if isExternalUser is true and document links are not shown', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
          },
          user: privatePractitionerUser,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showLinkToDocument).toBeFalsy();
    });

    it('should be false if isExternalUser is true and document links are not shown because the docket entry is a brief, not filed by practitioner', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            eventCode: 'SEAB',
          },
          user: privatePractitionerUser,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showLinkToDocument).toBeFalsy();
    });

    it('should be false if isExternalUser is false', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...servedCourtIssuedDocketEntry,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showLinkToDocument).toBeFalsy();
    });

    it('should be true for an external user when filedAfterPolicyChange is true and the document was filed by a practitioner', () => {
      const entry = {
        ...servedCourtIssuedDocketEntry,
        eventCode: BRIEF_EVENTCODES[0],
        filedByRole: ROLES.privatePractitioner,
      };
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry,
          user: privatePractitionerUser,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showLinkToDocument).toBe(true);
    });

    it('should be false for an external user when filedAfterPolicyChange is false and the document was filed by a practitioner', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          ...simpleDocketEntry,
          entry: {
            eventCode: BRIEF_EVENTCODES[0],
            rootDocument,
          },
          formattedCase: {
            ...MOCK_CASE,
            filedByRole: ROLES.privatePractitioner,
          },
          user: privatePractitionerUser,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showLinkToDocument).toBe(false);
    });
  });

  describe('showEditDocketRecordEntry', () => {
    it('should be true if user has EDIT_DOCKET_ENTRY permissions', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...servedCourtIssuedDocketEntry,
          },
          permissions: {
            EDIT_DOCKET_ENTRY: true,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showEditDocketRecordEntry).toBeTruthy();
    });

    it('should be false if user does not have EDIT_DOCKET_ENTRY permissions', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...servedCourtIssuedDocketEntry,
          },
          permissions: {
            EDIT_DOCKET_ENTRY: false,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showEditDocketRecordEntry).toBeFalsy();
    });
  });

  describe('showDocumentDescriptionWithoutLink', () => {
    it('should be true if document links are not shown and document is not processing', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showDocumentDescriptionWithoutLink).toBeTruthy();
    });

    it('should be false if document links are shown and document is not processing', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...servedCourtIssuedDocketEntry,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showDocumentDescriptionWithoutLink).toBeFalsy();
    });

    it('should be true when the user is external and NOT associated with the case and the docket entry is sealed', () => {
      const mockSealedDocketEntry = {
        documentTitle: 'Sealed to the public order',
        eventCode: 'O',
        isFileAttached: true,
        isSealed: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
        servedAt: '2019-03-01T21:00:00.000Z',
      };

      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: mockSealedDocketEntry,
          user: privatePractitionerUser,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showDocumentDescriptionWithoutLink).toBe(true);
    });

    it('should be false when the user is external and associated with the case and the docket entry is sealed', () => {
      const mockSealedDocketEntry = {
        documentTitle: 'Sealed to the public order',
        eventCode: 'O',
        isFileAttached: true,
        isSealed: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
        servedAt: '2019-03-01T21:00:00.000Z',
      };

      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: mockSealedDocketEntry,
          rawCase: {
            ...mockCase,
            privatePractitioners: [privatePractitionerUser],
          },
          user: privatePractitionerUser,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.showDocumentDescriptionWithoutLink).toBe(false);
    });
  });

  describe('editDocketEntryMetaLink', () => {
    it('should contain docketNumber and entry index', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            index: 1234,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.editDocketEntryMetaLink).toEqual(
        `/case-detail/${baseParams.docketNumber}/docket-entry/1234/edit-meta`,
      );
    });
  });

  describe('toolTipText', () => {
    it('should add a tooltip to (disabled) docket entries with no file attached', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: simpleDocketEntry,
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.toolTipText).toEqual('No Document View');
    });

    it('should not add a tooltip to docket entries with a file attached', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isFileAttached: true,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.toolTipText).toBeFalsy();
    });
  });

  describe('isSelectableForDownload', () => {
    it('should return true when entry is not a minute entry, has a file attached, and is on the docket record', () => {
      const entry = {
        eventCode: 'A',
        isFileAttached: true,
        isOnDocketRecord: true,
      } as RawDocketEntry;
      expect(isSelectableForDownload(entry)).toBe(true);
    });

    it('should return false when entry is a minute entry', () => {
      const entry = {
        eventCode: 'MINC',
        isFileAttached: true,
        isOnDocketRecord: true,
      } as RawDocketEntry;
      expect(isSelectableForDownload(entry)).toBe(false);
    });

    it('should return false when entry has no file attached', () => {
      const entry = {
        eventCode: 'A',
        isFileAttached: false,
        isOnDocketRecord: true,
      } as RawDocketEntry;
      expect(isSelectableForDownload(entry)).toBe(false);
    });

    it('should return false when entry is not on the docket record', () => {
      const entry = {
        eventCode: 'A',
        isFileAttached: true,
        isOnDocketRecord: false,
      } as RawDocketEntry;
      expect(isSelectableForDownload(entry)).toBe(false);
    });
  });

  describe('setupIconsToDisplay', () => {
    it('should display a sealed icon when entry has sealedTo set', () => {
      const icons = setupIconsToDisplay({
        formattedResult: {
          sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
          sealedToTooltip: 'Sealed to public',
        } as preformattedDocketEntry,
        isExternalUser: false,
      });
      expect(icons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            className: 'sealed-docket-entry',
            icon: 'lock',
            title: 'Sealed to public',
          }),
        ]),
      );
    });

    it('should return only the sealed icon for external users even if other flags are set', () => {
      const icons = setupIconsToDisplay({
        formattedResult: {
          sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
          sealedToTooltip: 'Sealed',
          isPaper: true,
        } as preformattedDocketEntry,
        isExternalUser: true,
      });
      expect(icons).toHaveLength(1);
      expect(icons[0].className).toBe('sealed-docket-entry');
    });

    it('should return empty array for external users with no sealed entry', () => {
      const icons = setupIconsToDisplay({
        formattedResult: {
          isPaper: true,
        } as preformattedDocketEntry,
        isExternalUser: true,
      });
      expect(icons).toHaveLength(0);
    });

    it('should display a paper icon when entry isPaper and user is internal', () => {
      const icons = setupIconsToDisplay({
        formattedResult: {
          isPaper: true,
        } as preformattedDocketEntry,
        isExternalUser: false,
      });
      expect(icons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            className: 'fa-icon-blue',
            title: 'Is paper',
          }),
        ]),
      );
    });

    it('should display an in-progress icon when entry isInProgress and user is internal', () => {
      const icons = setupIconsToDisplay({
        formattedResult: {
          isInProgress: true,
        } as preformattedDocketEntry,
        isExternalUser: false,
      });
      expect(icons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            className: 'fa-icon-gold',
            title: 'In progress',
          }),
        ]),
      );
    });

    it('should display a qcNeeded icon when entry has qcNeeded and user is internal', () => {
      const icons = setupIconsToDisplay({
        formattedResult: {
          qcNeeded: true,
        } as preformattedDocketEntry,
        isExternalUser: false,
      });
      expect(icons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            className: 'fa-icon-red',
            title: 'Is untouched',
          }),
        ]),
      );
    });

    it('should display a loading spinner icon when entry has showLoadingIcon and user is internal', () => {
      const icons = setupIconsToDisplay({
        formattedResult: {
          showLoadingIcon: true,
        } as preformattedDocketEntry,
        isExternalUser: false,
      });
      expect(icons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            className: 'fa-spin spinner',
            title: 'Is loading',
          }),
        ]),
      );
    });

    it('should return empty array for internal user with no special flags', () => {
      const icons = setupIconsToDisplay({
        formattedResult: {} as preformattedDocketEntry,
        isExternalUser: false,
      });
      expect(icons).toHaveLength(0);
    });
  });

  describe('getShowSealDocketRecordEntry', () => {
    it('should return true when event code is not an opinion event code', () => {
      expect(
        getShowSealDocketRecordEntry({
          entry: { eventCode: 'O' } as FormattedCaseDetailDocketEntry,
        }),
      ).toBe(true);
    });

    it('should return false when event code is an opinion event code with bench opinion', () => {
      const opinionCode = OPINION_EVENT_CODES_WITH_BENCH_OPINION[0];
      expect(
        getShowSealDocketRecordEntry({
          entry: { eventCode: opinionCode } as FormattedCaseDetailDocketEntry,
        }),
      ).toBe(false);
    });
  });

  describe('getShowEditDocketRecordEntry with restricted event codes', () => {
    it('should return false when entry eventCode is in the restricted event codes feature flag string', () => {
      const systemGeneratedEventCode = Object.values(
        SYSTEM_GENERATED_DOCUMENT_TYPES,
      )[0].eventCode;

      const result = runCompute(
        (get: Get) =>
          getShowEditDocketRecordEntry({
            entry: {
              eventCode: systemGeneratedEventCode,
              qcWorkItemsCompleted: true,
            } as FormattedCaseDetailDocketEntry,
            get,
            userPermissions: { EDIT_DOCKET_ENTRY: true },
          }),
        {
          state: {
            featureFlags: {
              'restricted-event-codes': systemGeneratedEventCode,
            },
          },
        },
      );

      expect(result).toBe(false);
    });

    it('should handle comma-separated restricted event codes', () => {
      const systemGeneratedEventCode = Object.values(
        SYSTEM_GENERATED_DOCUMENT_TYPES,
      )[0].eventCode;

      const result = runCompute(
        (get: Get) =>
          getShowEditDocketRecordEntry({
            entry: {
              eventCode: systemGeneratedEventCode,
              qcWorkItemsCompleted: true,
            } as FormattedCaseDetailDocketEntry,
            get,
            userPermissions: { EDIT_DOCKET_ENTRY: true },
          }),
        {
          state: {
            featureFlags: {
              'restricted-event-codes': `ABC, ${systemGeneratedEventCode}, XYZ`,
            },
          },
        },
      );

      expect(result).toBe(false);
    });

    it('should return true when restricted event codes is a string but does not include the entry eventCode', () => {
      const systemGeneratedEventCode = Object.values(
        SYSTEM_GENERATED_DOCUMENT_TYPES,
      )[0].eventCode;

      const result = runCompute(
        (get: Get) =>
          getShowEditDocketRecordEntry({
            entry: {
              eventCode: systemGeneratedEventCode,
              qcWorkItemsCompleted: true,
            } as FormattedCaseDetailDocketEntry,
            get,
            userPermissions: { EDIT_DOCKET_ENTRY: true },
          }),
        {
          state: {
            featureFlags: {
              'restricted-event-codes': 'ZZZZZ',
            },
          },
        },
      );

      expect(result).toBe(true);
    });

    it('should return true for a system-generated minute entry with EDIT_DOCKET_ENTRY permission', () => {
      const systemGeneratedEventCode = Object.values(
        SYSTEM_GENERATED_DOCUMENT_TYPES,
      )[0].eventCode;

      const result = runCompute((get: Get) =>
        getShowEditDocketRecordEntry({
          entry: {
            eventCode: systemGeneratedEventCode,
            qcWorkItemsCompleted: true,
          } as FormattedCaseDetailDocketEntry,
          get,
          userPermissions: { EDIT_DOCKET_ENTRY: true },
        }),
      );

      expect(result).toBe(true);
    });

    it('should return true for a served court-issued document with EDIT_DOCKET_ENTRY permission', () => {
      const result = runCompute((get: Get) =>
        getShowEditDocketRecordEntry({
          entry: {
            ...servedCourtIssuedDocketEntry,
          } as FormattedCaseDetailDocketEntry,
          get,
          userPermissions: { EDIT_DOCKET_ENTRY: true },
        }),
      );

      expect(result).toBe(true);
    });

    it('should return true for an unservable court-issued document with EDIT_DOCKET_ENTRY permission', () => {
      const unservableEventCode = UNSERVABLE_EVENT_CODES[0];

      const result = runCompute((get: Get) =>
        getShowEditDocketRecordEntry({
          entry: {
            eventCode: unservableEventCode,
            isCourtIssuedDocument: true,
            qcWorkItemsCompleted: true,
          } as FormattedCaseDetailDocketEntry,
          get,
          userPermissions: { EDIT_DOCKET_ENTRY: true },
        }),
      );

      expect(result).toBe(true);
    });

    it('should return false for an unserved court-issued document that is not unservable', () => {
      const result = runCompute((get: Get) =>
        getShowEditDocketRecordEntry({
          entry: {
            eventCode: 'O',
            isCourtIssuedDocument: true,
            qcWorkItemsCompleted: true,
          } as FormattedCaseDetailDocketEntry,
          get,
          userPermissions: { EDIT_DOCKET_ENTRY: true },
        }),
      );

      expect(result).toBe(false);
    });
  });

  describe('sealButtonTooltip', () => {
    it('should be "Seal to the public" when entry is not sealed', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isSealed: false,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.sealButtonTooltip).toBe('Seal to the public');
    });

    it('should be "Unseal to the public and parties of this case" when entry is sealed to EXTERNAL', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isSealed: true,
            sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.sealButtonTooltip).toBe(
        'Unseal to the public and parties of this case',
      );
    });

    it('should be "Unseal to the public" when entry is sealed to PUBLIC', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isSealed: true,
            sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.sealButtonTooltip).toBe('Unseal to the public');
    });
  });

  describe('sealButtonText and sealIcon', () => {
    it('should have sealButtonText "Unseal" and sealIcon "unlock" when entry is sealed', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isSealed: true,
            sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.sealButtonText).toBe('Unseal');
      expect(result.sealIcon).toBe('unlock');
    });

    it('should have sealButtonText "Seal" and sealIcon "lock" when entry is not sealed', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isSealed: false,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.sealButtonText).toBe('Seal');
      expect(result.sealIcon).toBe('lock');
    });
  });

  describe('sealedToTooltip', () => {
    it('should call getSealedDocketEntryTooltip when entry is sealed and sealedToTooltip is not already set', () => {
      applicationContext
        .getUtilities()
        .getSealedDocketEntryTooltip.mockReturnValue('Sealed to the public');

      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isSealed: true,
            sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
            sealedToTooltip: undefined,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(
        applicationContext.getUtilities().getSealedDocketEntryTooltip,
      ).toHaveBeenCalled();
      expect(result.sealedToTooltip).toBe('Sealed to the public');
    });

    it('should return empty string when entry is not sealed and sealedToTooltip is not set', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isSealed: false,
            sealedToTooltip: undefined,
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.sealedToTooltip).toBe('');
    });

    it('should preserve existing sealedToTooltip if already set', () => {
      const result = runCompute((get: Get) =>
        getFormattedDocketEntry({
          ...baseParams,
          get,
          entry: {
            ...simpleDocketEntry,
            isSealed: true,
            sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
            sealedToTooltip: 'Already set tooltip',
          },
        }),
      ) as unknown as FormattedDocketEntry;

      expect(result.sealedToTooltip).toBe('Already set tooltip');
    });
  });

  describe('relatedDocketEntries', () => {
    const mockMotionEntry = {
      ...simpleDocketEntry,
      docketEntryId: 'motion-123',
      eventCode: 'M115',
      index: 5,
      documentTitle: 'Motion for Leave to File',
    };

    const mockOrderEntry = {
      ...simpleDocketEntry,
      docketEntryId: 'order-456',
      eventCode: 'O',
      index: 10,
      documentTitle: 'Order',
      isFileAttached: true,
      isOnDocketRecord: true,
      servedAt: '2019-03-01T21:00:00.000Z',
    };

    it('should throw an error when a related docket entry is not found in rawCase.docketEntries', () => {
      const entryWithAffectedBy = {
        ...simpleDocketEntry,
        docketEntryId: 'entry-with-affected',
        documentTitle: 'Some Motion',
        affectedByDocketEntries: [
          {
            docketEntryId: 'nonexistent-id',
            disposition: MOTION_DISPOSITIONS.GRANTED,
          },
        ],
      };

      mockCase.docketEntries = [];

      expect(() =>
        runCompute((get: Get) =>
          getFormattedDocketEntry({
            ...baseParams,
            get,
            entry: entryWithAffectedBy,
            rawCase: mockCase,
          }),
        ),
      ).toThrow('Related order not found');
    });

    it('should throw an error when a related docket entry from affectedDocketEntries is not found', () => {
      const entryWithAffected = {
        ...simpleDocketEntry,
        docketEntryId: 'entry-with-affected',
        documentTitle: 'Some Order',
        affectedDocketEntries: [
          {
            docketEntryId: 'nonexistent-id',
            disposition: MOTION_DISPOSITIONS.GRANTED,
          },
        ],
      };

      mockCase.docketEntries = [];

      expect(() =>
        runCompute((get: Get) =>
          getFormattedDocketEntry({
            ...baseParams,
            get,
            entry: entryWithAffected,
            rawCase: mockCase,
          }),
        ),
      ).toThrow('Related order not found');
    });

    describe('affectedByDocketEntries - dispositionLinkText from MOTION perspective', () => {
      it('should format dispositionLinkText as "GRANTED BY #[index]" when disposition is GRANTED', () => {
        const entryWithAffectedBy = {
          ...mockOrderEntry,
          affectedByDocketEntries: [
            {
              docketEntryId: 'motion-123',
              disposition: MOTION_DISPOSITIONS.GRANTED,
            },
          ],
        };

        mockCase.docketEntries = [mockMotionEntry, mockOrderEntry];

        const result = runCompute((get: Get) =>
          getFormattedDocketEntry({
            ...baseParams,
            get,
            entry: entryWithAffectedBy,
            rawCase: mockCase,
          }),
        ) as unknown as FormattedDocketEntry;

        expect(result.relatedDocketEntries[0].dispositionLinkText).toEqual([
          'GRANTED BY #5',
        ]);
      });

      it('should format dispositionLinkText as array with both "GRANTED IN PART BY" and "DENIED IN PART BY" when disposition is GRANTED IN PART AND DENIED IN PART', () => {
        const entryWithAffectedBy = {
          ...mockOrderEntry,
          affectedByDocketEntries: [
            {
              docketEntryId: 'motion-123',
              disposition:
                MOTION_DISPOSITIONS.GRANTED_IN_PART_AND_DENIED_IN_PART,
            },
          ],
        };

        mockCase.docketEntries = [mockMotionEntry, mockOrderEntry];

        const result = runCompute((get: Get) =>
          getFormattedDocketEntry({
            ...baseParams,
            get,
            entry: entryWithAffectedBy,
            rawCase: mockCase,
          }),
        ) as unknown as FormattedDocketEntry;

        expect(result.relatedDocketEntries[0].dispositionLinkText).toEqual([
          'GRANTED IN PART BY #5',
          'DENIED IN PART BY #5',
        ]);
      });
    });

    describe('affectedDocketEntries - dispositionLinkText from ORDER perspective', () => {
      it('should format dispositionLinkText as "GRANTING #[index]" when disposition is GRANTED', () => {
        const entryWithAffected = {
          ...mockMotionEntry,
          affectedDocketEntries: [
            {
              docketEntryId: 'order-456',
              disposition: MOTION_DISPOSITIONS.GRANTED,
            },
          ],
        };

        mockCase.docketEntries = [mockMotionEntry, mockOrderEntry];

        const result = runCompute((get: Get) =>
          getFormattedDocketEntry({
            ...baseParams,
            get,
            entry: entryWithAffected,
            rawCase: mockCase,
          }),
        ) as unknown as FormattedDocketEntry;

        expect(result.relatedDocketEntries[0].dispositionLinkText).toEqual([
          'GRANTING #10',
        ]);
      });

      it('should format dispositionLinkText as array with both "GRANTING IN PART" and "DENYING IN PART" when disposition is GRANTED IN PART AND DENIED IN PART', () => {
        const entryWithAffected = {
          ...mockMotionEntry,
          affectedDocketEntries: [
            {
              docketEntryId: 'order-456',
              disposition:
                MOTION_DISPOSITIONS.GRANTED_IN_PART_AND_DENIED_IN_PART,
            },
          ],
        };

        mockCase.docketEntries = [mockMotionEntry, mockOrderEntry];

        const result = runCompute((get: Get) =>
          getFormattedDocketEntry({
            ...baseParams,
            get,
            entry: entryWithAffected,
            rawCase: mockCase,
          }),
        ) as unknown as FormattedDocketEntry;

        expect(result.relatedDocketEntries[0].dispositionLinkText).toEqual([
          'GRANTING IN PART #10',
          'DENYING IN PART #10',
        ]);
      });
    });
  });
});
