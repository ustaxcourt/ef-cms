import {
  CASE_STATUS_TYPES,
  INITIAL_DOCUMENT_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { paperDocketEntryHelper as paperDocketEntryHelperComputed } from './paperDocketEntryHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';

const paperDocketEntryHelper = withAppContextDecorator(
  paperDocketEntryHelperComputed,
  applicationContext,
);
describe('paperDocketEntryHelper', () => {
  it('should set showAddDocumentWarning to TRUE if docketEntryId is NOT set, documentUploadMode is not preview, and user is editing docket entry', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {},
        currentViewMetadata: {
          documentUploadMode: 'scan',
        },
        isEditingDocketEntry: true,
      },
    });

    expect(result.showAddDocumentWarning).toBeTruthy();
  });

  it('should set showAddDocumentWarning to FALSE if docketEntryId is NOT set, documentUploadMode is not preview, and user is NOT editing docket entry', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {},
        currentViewMetadata: {
          documentUploadMode: 'scan',
        },
        isEditingDocketEntry: false,
      },
    });

    expect(result.showAddDocumentWarning).toBeFalsy();
  });

  it('should set showAddDocumentWarning to FALSE if docketEntryId is set in the state, documentUploadMode is preview, and user is editing docket entry with a document attached', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            { docketEntryId: 'document-id-123', isFileAttached: true },
          ],
        },
        currentViewMetadata: {
          documentUploadMode: 'preview',
        },
        docketEntryId: 'document-id-123',
        isEditingDocketEntry: true,
      },
    });

    expect(result.showAddDocumentWarning).toBeFalsy();
  });

  it('should set showAddDocumentWarning to TRUE if docketEntryId is set in the state, documentUploadMode is not preview, and user is editing docket entry with NO document attached', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            { docketEntryId: 'document-id-123', isFileAttached: false },
          ],
        },
        currentViewMetadata: {
          documentUploadMode: 'scan',
        },
        docketEntryId: 'document-id-123',
        isEditingDocketEntry: true,
      },
    });

    expect(result.showAddDocumentWarning).toBeTruthy();
  });

  it('should set showSaveAndServeButton to true and showServiceWarning to false if the case can allow service', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '123',
              documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
              servedAt: '2019-03-01T21:40:46.415Z',
            },
            { docketEntryId: 'document-id-123', isFileAttached: false },
          ],
          stattus: CASE_STATUS_TYPES.generalDocket,
        },
        currentViewMetadata: {
          documentUploadMode: 'scan',
        },
        docketEntryId: 'document-id-123',
        isEditingDocketEntry: true,
      },
    });

    expect(result.showSaveAndServeButton).toBeTruthy();
    expect(result.showServiceWarning).toBeFalsy();
  });

  it('should set showSaveAndServeButton to false and showServiceWarning to true if the case can NOT allow service', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '123',
              documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
              servedAt: undefined,
            },
            { docketEntryId: 'document-id-123', isFileAttached: false },
          ],
          status: CASE_STATUS_TYPES.new,
        },
        currentViewMetadata: {
          documentUploadMode: 'scan',
        },
        docketEntryId: 'document-id-123',
        isEditingDocketEntry: true,
      },
    });

    expect(result.showSaveAndServeButton).toBeFalsy();
    expect(result.showServiceWarning).toBeTruthy();
  });
});
