import { DOCKET_RECORD_FILTER_OPTIONS } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryForTrialExhibit } from './journey/docketClerkAddsDocketEntryForTrialExhibit';
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
  cerebralTest.draftOrders = [];

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(
    cerebralTest,
    fakeFile,
    'Birmingham, Alabama',
    false,
  );
  petitionsClerkSubmitsCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);
  docketClerkAddsDocketEntryForTrialExhibit(cerebralTest, {
    draftOrderIndex: 0,
  });

  it('docket clerk views docket record filtered for exhibit document types', async () => {
    expect(cerebralTest.getState('sessionMetadata.docketRecordFilter')).toBe(
      DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
    );

    const unfilteredDocketEntriesOnDocketRecord =
      await getFormattedDocketEntriesForTest(cerebralTest);
    let { docketEntries } = cerebralTest.getState('caseDetail');
    docketEntries = docketEntries.filter(doc => !doc.isDraft);

    expect(
      unfilteredDocketEntriesOnDocketRecord.formattedDocketEntriesOnDocketRecord
        .length,
    ).toBe(docketEntries.length);

    cerebralTest.setState(
      'sessionMetadata.docketRecordFilter',
      DOCKET_RECORD_FILTER_OPTIONS.exhibits,
    );

    const filteredDocketEntriesOnDocketRecord =
      await getFormattedDocketEntriesForTest(cerebralTest);

    expect(
      filteredDocketEntriesOnDocketRecord.formattedDocketEntriesOnDocketRecord
        .length,
    ).toBe(1);
  });
});
