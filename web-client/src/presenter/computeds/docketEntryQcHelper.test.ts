import { docketEntryQcHelper as docketEntryQcHelperComputed } from './docketEntryQcHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const docketEntryQcHelper = withAppContextDecorator(
  docketEntryQcHelperComputed,
);

describe('docketEntryQcHelper', () => {
  it('should return false for showPaperServiceWarning if the document is not a contact change document type', () => {
    const result = runCompute(docketEntryQcHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Generic Document',
              multiDocketedOn: [],
            },
          ],
        },
        docketEntryId: 'abc',
        formattedCaseDetail: {
          consolidatedCases: [{ docketNumber: '1234' }],
        },
      },
    });
    expect(result.showPaperServiceWarning).toEqual(false);
  });

  it('should return false for showPaperServiceWarning if the document is a contact change document type but does not have incomplete qc work items', () => {
    const result = runCompute(docketEntryQcHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Notice of Change of Address',
              multiDocketedOn: [],

              workItem: { isRead: true },
            },
          ],
        },
        docketEntryId: 'abc',
        formattedCaseDetail: {
          consolidatedCases: [{ docketNumber: '1234' }],
        },
      },
    });
    expect(result.showPaperServiceWarning).toEqual(false);
  });

  it('should return false for showPaperServiceWarning if the document is a contact change document type and it does not have any work items', () => {
    const result = runCompute(docketEntryQcHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Notice of Change of Address',
              multiDocketedOn: [],
            },
          ],
        },
        docketEntryId: 'abc',
        formattedCaseDetail: {
          consolidatedCases: [{ docketNumber: '1234' }],
        },
      },
    });
    expect(result.showPaperServiceWarning).toEqual(false);
  });

  it('should return true for showPaperServiceWarning if the document is a contact change document type and it has incomplete qc work items', () => {
    const result = runCompute(docketEntryQcHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Notice of Change of Address',
              multiDocketedOn: [],
              qcViewed: false,
              workItemId: 'someId',
            },
          ],
        },
        formattedCaseDetail: {
          consolidatedCases: [{ docketNumber: '1234' }],
        },
        docketEntryId: 'abc',
      },
    });
    expect(result.showPaperServiceWarning).toEqual(true);
  });

  it('should return multiDocketedOn that excludes current case and is currently in multiDocketedOn', () => {
    const result = runCompute(docketEntryQcHelper, {
      state: {
        caseDetail: {
          docketNumber: '123-00',
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Notice of Change of Address',
              multiDocketedOn: ['123-00', '124-00', '125-00'],
              qcViewed: false,
              workItemId: 'someId',
            },
          ],
        },
        formattedCaseDetail: {
          consolidatedCases: [
            { caseTitle: 'Case 123', docketNumber: '123-00' },
            { caseTitle: 'Case 124', docketNumber: '124-00' },
            { caseTitle: 'Case 125', docketNumber: '125-00' },
            { caseTitle: 'Case 126', docketNumber: '126-00' },
          ],
        },
        docketEntryId: 'abc',
      },
    });
    expect(result.multiDocketedOn).toEqual([
      { caseTitle: 'Case 124', docketNumber: '124-00' },
      { caseTitle: 'Case 125', docketNumber: '125-00' },
    ]);
  });
});
