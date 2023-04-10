import { DOCKET_RECORD_FILTER_OPTIONS } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryForMotion } from './journey/docketClerkAddsDocketEntryForMotion';
import { docketClerkAddsDocketEntryForTrialExhibit } from './journey/docketClerkAddsDocketEntryForTrialExhibit';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import {
  fakeFile,
  getFormattedDocketEntriesForTest,
  loginAs,
  setupTest,
} from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

describe('Docket Record Filter Journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
    cerebralTest.draftOrders = [];
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, { shouldServe: false });
  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);
  docketClerkAddsDocketEntryForTrialExhibit(cerebralTest, {
    draftOrderIndex: 0,
  });
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 1);
  docketClerkAddsDocketEntryForMotion(cerebralTest);

  it('docket clerk views docket record filtered for all document types', async () => {
    expect(cerebralTest.getState('sessionMetadata.docketRecordFilter')).toBe(
      DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
    );

    const docketEntries = cerebralTest
      .getState('caseDetail.docketEntries')
      .filter(doc => !doc.isDraft);
    const filteredDocketEntriesOnDocketRecord =
      await getFormattedDocketEntriesForTest(cerebralTest);

    expect(
      filteredDocketEntriesOnDocketRecord.formattedDocketEntriesOnDocketRecord
        .length,
    ).toBe(docketEntries.length);
  });

  it('docket clerk views docket record filtered for exhibit document types', async () => {
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'sessionMetadata.docketRecordFilter',
      value: DOCKET_RECORD_FILTER_OPTIONS.exhibits,
    });

    const filteredDocketEntriesOnDocketRecord =
      await getFormattedDocketEntriesForTest(cerebralTest);

    expect(
      filteredDocketEntriesOnDocketRecord.formattedDocketEntriesOnDocketRecord
        .length,
    ).toBe(1);
    expect(
      filteredDocketEntriesOnDocketRecord
        .formattedDocketEntriesOnDocketRecord[0].eventCode,
    ).toBe('TE');
  });

  it('docket clerk views docket record filtered for motion document types', async () => {
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'sessionMetadata.docketRecordFilter',
      value: DOCKET_RECORD_FILTER_OPTIONS.motions,
    });

    const filteredDocketEntriesOnDocketRecord =
      await getFormattedDocketEntriesForTest(cerebralTest);

    expect(
      filteredDocketEntriesOnDocketRecord.formattedDocketEntriesOnDocketRecord
        .length,
    ).toBe(1);
    expect(
      filteredDocketEntriesOnDocketRecord
        .formattedDocketEntriesOnDocketRecord[0].eventCode,
    ).toBe('M000');
  });

  it('docket clerk views docket record filtered for order document types', async () => {
    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'sessionMetadata.docketRecordFilter',
      value: DOCKET_RECORD_FILTER_OPTIONS.orders,
    });

    const filteredDocketEntriesOnDocketRecord =
      await getFormattedDocketEntriesForTest(cerebralTest);

    expect(
      filteredDocketEntriesOnDocketRecord.formattedDocketEntriesOnDocketRecord
        .length,
    ).toBe(1);
    expect(
      filteredDocketEntriesOnDocketRecord
        .formattedDocketEntriesOnDocketRecord[0].eventCode,
    ).toBe('O');
  });
});
