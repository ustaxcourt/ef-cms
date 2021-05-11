import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getShowEditDocketRecordEntry } from './formattedDocketEntries';

describe('getShowEditDocketRecordEntry', () => {
  it('should not show the edit button if the docket entry document has not been QCed', () => {
    const result = getShowEditDocketRecordEntry({
      applicationContext,
      entry: {
        documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
        documentType: 'Motion to Dismiss for Lack of Jurisdiction',
        eventCode: 'M073',
        isCourtIssuedDocument: false,
        qcWorkItemsCompleted: false,
      },
      userPermissions: { EDIT_DOCKET_ENTRY: true },
    });

    expect(result).toBeFalsy();
  });

  it('should show the edit button if the docket entry document has been QCed as part of the petition QC', () => {
    const result = getShowEditDocketRecordEntry({
      applicationContext,
      entry: {
        documentTitle: 'Ownership Disclosure Statement',
        documentType: 'Ownership Disclosure Statement',
        eventCode: 'DISC',
        isCourtIssuedDocument: false,
        isMinuteEntry: false,
        qcWorkItemsCompleted: true,
        servedAt: '2020-10-21T13:47:20.482Z',
      },
      userPermissions: { EDIT_DOCKET_ENTRY: true },
    });

    expect(result).toBeTruthy();
  });

  it('should not show the edit button if the user does not have permission', () => {
    const result = getShowEditDocketRecordEntry({
      applicationContext,
      entry: {
        documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
        documentType: 'Motion to Dismiss for Lack of Jurisdiction',
        eventCode: 'M073',
        isCourtIssuedDocument: false,
        qcWorkItemsCompleted: true,
      },
      userPermissions: { EDIT_DOCKET_ENTRY: false },
    });

    expect(result).toBeFalsy();
  });

  it('should show the edit button if the docket entry document is QCed and the user has permission', () => {
    const result = getShowEditDocketRecordEntry({
      applicationContext,
      entry: {
        documentTitle: 'Motion to Dismiss for Lack of Jurisdiction',
        documentType: 'Motion to Dismiss for Lack of Jurisdiction',
        eventCode: 'M073',
        isCourtIssuedDocument: false,
        qcWorkItemsCompleted: true,
      },
      userPermissions: { EDIT_DOCKET_ENTRY: true },
    });

    expect(result).toBeTruthy();
  });

  it('should show the edit button if the docket entry has no document and the user has permission', () => {
    const result = getShowEditDocketRecordEntry({
      applicationContext,
      entry: {
        eventCode: 'FEE',
        isCourtIssuedDocument: false,
        isMinuteEntry: true,
        qcWorkItemsCompleted: true,
      },
      userPermissions: { EDIT_DOCKET_ENTRY: true },
    });

    expect(result).toBeTruthy();
  });

  it('should show the edit button if the docket entry has a system generated document', () => {
    const result = getShowEditDocketRecordEntry({
      applicationContext,
      entry: {
        documentTitle: 'System Generated',
        documentType: 'Notice of Trial',
        eventCode: 'NTD',
        isCourtIssuedDocument: true,
        qcWorkItemsCompleted: true,
        servedAt: '2019-06-19T17:29:13.120Z',
      },
      userPermissions: { EDIT_DOCKET_ENTRY: true },
    });

    expect(result).toBeTruthy();
  });

  it('should NOT show the edit button if the docket entry has an unserved court issued document', () => {
    const result = getShowEditDocketRecordEntry({
      applicationContext,
      entry: {
        documentTitle: 'Court Issued - Not Served',
        documentType: 'Order',
        eventCode: 'O',
        isCourtIssuedDocument: true,
        qcWorkItemsCompleted: true,
      },
      userPermissions: { EDIT_DOCKET_ENTRY: true },
    });

    expect(result).toBeFalsy();
  });

  it('should show the edit button if the docket entry has a served court issued document', () => {
    const result = getShowEditDocketRecordEntry({
      applicationContext,
      entry: {
        documentTitle: 'Court Issued - Served',
        documentType: 'Order',
        eventCode: 'O',
        isCourtIssuedDocument: true,
        qcWorkItemsCompleted: true,
        servedAt: '2019-06-19T17:29:13.120Z',
      },
      userPermissions: { EDIT_DOCKET_ENTRY: true },
    });

    expect(result).toBeTruthy();
  });

  it('should show the edit button if the document is an unservable court issued document', () => {
    const result = getShowEditDocketRecordEntry({
      applicationContext,
      entry: {
        documentTitle: 'U.S.C.A',
        documentType: 'U.S.C.A.',
        eventCode: 'USCA',
        isCourtIssuedDocument: true,
        qcWorkItemsCompleted: true,
        servedAt: '2019-06-19T17:29:13.120Z',
      },
      userPermissions: { EDIT_DOCKET_ENTRY: true },
    });

    expect(result).toBeTruthy();
  });
});
