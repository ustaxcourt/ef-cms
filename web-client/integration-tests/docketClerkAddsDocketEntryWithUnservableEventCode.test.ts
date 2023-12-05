import { FORMATS } from '@shared/business/utilities/DateHandler';
import { UNSERVABLE_EVENT_CODES } from '../../shared/src/business/entities/EntityConstants';
import { addCourtIssuedDocketEntryHelper } from '../src/presenter/computeds/addCourtIssuedDocketEntryHelper';
import { caseDetailHeaderHelper } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { caseDetailSubnavHelper } from '../src/presenter/computeds/caseDetailSubnavHelper';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket Clerk Adds Docket Entry With Unservable Event Code', () => {
  const cerebralTest = setupTest();

  cerebralTest.draftOrders = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      procedureType: 'Regular',
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);

  it('adds a docket entry with an unservable event code', async () => {
    const getHelper = () => {
      return runCompute(
        withAppContextDecorator(addCourtIssuedDocketEntryHelper),
        {
          state: cerebralTest.getState(),
        },
      );
    };

    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: cerebralTest.draftOrders[0].docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(getHelper().showReceivedDate).toEqual(false);

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: UNSERVABLE_EVENT_CODES[0], // CTRA
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'Corrected Transcript',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: 'for test',
      },
    );

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'date',
        toFormat: FORMATS.ISO,
        value: '1/1/2020',
      },
    );

    expect(getHelper().showReceivedDate).toEqual(true);

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      filingDate: 'Enter a filing date',
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'filingDate',
        toFormat: FORMATS.ISO,
        value: '1/1/2021',
      },
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to the docket record.',
    );

    await cerebralTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
      docketRecordIndex: 3,
    });

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'pending',
        value: true,
      },
    );

    await cerebralTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await refreshElasticsearchIndex();

    const headerHelper = runCompute(
      withAppContextDecorator(caseDetailHeaderHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(headerHelper.showBlockedTag).toBeTruthy();

    const caseDetailSubnav = runCompute(
      withAppContextDecorator(caseDetailSubnavHelper),
      {
        state: cerebralTest.getState(),
      },
    );
    expect(caseDetailSubnav.showTrackedItemsNotification).toBeTruthy();

    await cerebralTest.runSequence('gotoPendingReportSequence');

    await cerebralTest.runSequence('setPendingReportSelectedJudgeSequence', {
      judge: 'Chief Judge',
    });

    await cerebralTest.runSequence('loadMorePendingItemsSequence');

    const pendingItems = cerebralTest.getState('pendingReports.pendingItems');
    expect(
      pendingItems.find(
        item => item.docketNumber === cerebralTest.docketNumber,
      ),
    ).toBeDefined();
  });
});
