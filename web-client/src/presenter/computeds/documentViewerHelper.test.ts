import {
  CASE_STATUS_TYPES,
  INITIAL_DOCUMENT_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { docketClerkUser } from '../../../../shared/src/test/mockUsers';
import { documentViewerHelper as documentViewerHelperComputed } from './documentViewerHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../src/withAppContext';

const documentViewerHelper = withAppContextDecorator(
  documentViewerHelperComputed,
  applicationContext,
);

describe('documentViewerHelper', () => {
  const DOCKET_ENTRY_ID = 'b8947b11-19b3-4c96-b7a1-fa6a5654e2d5';

  const baseDocketEntry = {
    createdAt: '2018-11-21T20:49:28.192Z',
    docketEntryId: DOCKET_ENTRY_ID,
    documentTitle: 'Petition',
    documentType: 'Petition',
    eventCode: INITIAL_DOCUMENT_TYPES.petition.documentType,
    index: 1,
    isOnDocketRecord: true,
  };

  const getBaseState = user => {
    return {
      permissions: getUserPermissions(user),
      viewerDocumentToDisplay: {
        docketEntryId: DOCKET_ENTRY_ID,
      },
    };
  };

  beforeAll(() => {
    applicationContext.getCurrentUser = jest
      .fn()
      .mockReturnValue(docketClerkUser);
  });

  it('should return an empty object if the requested docketEntryId is not found in the docket record', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
        },
        viewerDocumentToDisplay: {
          docketEntryId: '0848a72a-e61b-4721-b4b8-b2a19ee98baa',
        },
      },
    });
    expect(result).toEqual({});
  });

  it('should return the document description and filed label', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              filedBy: 'Test Petitioner',
              filingDate: '2018-11-21T20:49:28.192Z',
            },
          ],
        },
      },
    });
    expect(result.description).toEqual('Petition');
    expect(result.filedLabel).toEqual('Filed 11/21/18 by Test Petitioner');
  });

  it('should return an empty filed label for court-issued documents', () => {
    const result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              documentType: 'Order',
            },
          ],
        },
      },
    });
    expect(result.filedLabel).toEqual('');
  });

  it('should return showSealedInBlackstone true or false based on whether the document has isLegacySealed', () => {
    let result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              isLegacySealed: false,
            },
          ],
        },
      },
    });
    expect(result.showSealedInBlackstone).toEqual(false);

    result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              isLegacySealed: true,
            },
          ],
        },
      },
    });
    expect(result.showSealedInBlackstone).toEqual(true);
  });

  it('should return a served label if the document has been served', () => {
    let result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDocketEntry],
        },
      },
    });
    expect(result.servedLabel).toEqual('');

    result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              servedAt: '2018-11-21T20:49:28.192Z',
            },
          ],
        },
      },
    });
    expect(result.servedLabel).toEqual('Served 11/21/18');
  });

  it('should return showNotServed true if the document type is servable and does not have a servedAt', () => {
    const { showNotServed } = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              documentType: 'Order',
              eventCode: 'O',
            },
          ],
        },
      },
    });

    expect(showNotServed).toEqual(true);
  });

  it('should show stricken information if the docket entry has been stricken', () => {
    let result = runCompute(documentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDocketEntry,
              isStricken: true,
            },
          ],
        },
      },
    });

    expect(result.showStricken).toEqual(true);
  });

  describe('showUnservedPetitionWarning', () => {
    it('should be false if a servable document is selected and the case is eligible for service', () => {
      const { showUnservedPetitionWarning } = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry, // the petition
                docketEntryId: '77747b11-19b3-4c96-b7a1-fa6a5654e2d5',
                servedAt: undefined,
              },
              { ...baseDocketEntry, documentType: 'Order', eventCode: 'O' },
            ],
            status: CASE_STATUS_TYPES.calendared,
          },
        },
      });

      expect(showUnservedPetitionWarning).toBe(false);
    });

    it('should be true if an otherwise servable document is selected but the case is new', () => {
      const { showUnservedPetitionWarning } = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry, // the petition
                docketEntryId: '77747b11-19b3-4c96-b7a1-fa6a5654e2d5',
                servedAt: undefined,
              },
              { ...baseDocketEntry, documentType: 'Order', eventCode: 'O' },
            ],
            status: CASE_STATUS_TYPES.new,
          },
        },
      });

      expect(showUnservedPetitionWarning).toBe(true);
    });

    it('should be false if the selected document is the petition', () => {
      const { showUnservedPetitionWarning } = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [baseDocketEntry],
          },
        },
      });

      expect(showUnservedPetitionWarning).toBe(false);
    });

    it('should be false if an servable document is selected and the petition on the case is served', () => {
      const { showUnservedPetitionWarning } = runCompute(documentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDocketEntry, // the petition
                docketEntryId: '77747b11-19b3-4c96-b7a1-fa6a5654e2d5',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
              { ...baseDocketEntry, documentType: 'Order', eventCode: 'O' },
            ],
          },
        },
      });

      expect(showUnservedPetitionWarning).toBe(false);
    });
  });
});
