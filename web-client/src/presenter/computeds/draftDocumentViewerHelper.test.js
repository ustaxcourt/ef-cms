import { applicationContext } from '../../applicationContext';
import { draftDocumentViewerHelper as draftDocumentViewerHelperComputed } from './draftDocumentViewerHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';

const draftDocumentViewerHelper = withAppContextDecorator(
  draftDocumentViewerHelperComputed,
  applicationContext,
);

describe('draftDocumentViewerHelper', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser = jest.fn().mockReturnValue({
      role: 'docketclerk',
      userId: '123',
    });
  });

  it('should return the document title', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });
    expect(result.documentTitle).toEqual('Order to do something');
  });

  it('should return the created by label', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
              filedBy: 'Test Petitionsclerk',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });
    expect(result.createdByLabel).toEqual('Created by Test Petitionsclerk');
  });

  it('should return an empty string for the created by label if filedBy is empty', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });
    expect(result.createdByLabel).toEqual('');
  });

  it('should return empty strings if the provided documentId is not found in draft documents', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: '123',
        },
      },
    });
    expect(result).toEqual({ createdByLabel: '', documentTitle: '' });
  });
});
