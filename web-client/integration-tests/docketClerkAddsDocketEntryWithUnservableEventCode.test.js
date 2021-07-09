import { addCourtIssuedDocketEntryHelper } from '../src/presenter/computeds/addCourtIssuedDocketEntryHelper';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { caseDetailHeaderHelper } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { caseDetailSubnavHelper } from '../src/presenter/computeds/caseDetailSubnavHelper';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
} from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Docket Clerk Adds Docket Entry With Unservable Event Code', () => {
  const { UNSERVABLE_EVENT_CODES } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerChoosesProcedureType(cerebralTest, { procedureType: 'Regular' });
  petitionerChoosesCaseType(cerebralTest);
  petitionerCreatesNewCase(cerebralTest, fakeFile);

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
        key: 'freeText',
        value: 'for test',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'month',
        value: '1',
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'day',
        value: '1',
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'year',
        value: '2020',
      },
    );

    expect(getHelper().showReceivedDate).toEqual(true);

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      filingDate: 'Enter a filing date',
    });

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'filingDateMonth',
        value: '1',
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'filingDateDay',
        value: '1',
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'filingDateYear',
        value: '2021',
      },
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
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

    const pendingItems = cerebralTest.getState('pendingReports.pendingItems');
    expect(
      pendingItems.find(
        item => item.docketNumber === cerebralTest.docketNumber,
      ),
    ).toBeDefined();
  });
});
