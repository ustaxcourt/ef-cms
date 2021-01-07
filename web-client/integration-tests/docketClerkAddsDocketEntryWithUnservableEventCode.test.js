import { addCourtIssuedDocketEntryHelper } from '../src/presenter/computeds/addCourtIssuedDocketEntryHelper';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Adds Docket Entry With Unservable Event Code', () => {
  const { UNSERVABLE_EVENT_CODES } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);

  loginAs(test, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(test, fakeFile);

  it('adds a docket entry with an unservable event code', async () => {
    const getHelper = () => {
      return runCompute(
        withAppContextDecorator(addCourtIssuedDocketEntryHelper),
        {
          state: test.getState(),
        },
      );
    };

    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: test.draftOrders[0].docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(getHelper().showReceivedDate).toEqual(false);

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: UNSERVABLE_EVENT_CODES[0], // CTRA
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'for test',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'month',
      value: '1',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'day',
      value: '1',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'year',
      value: '2020',
    });

    expect(getHelper().showReceivedDate).toEqual(true);

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({
      filingDate: 'Enter a filing date',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'filingDateMonth',
      value: '1',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'filingDateDay',
      value: '1',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'filingDateYear',
      value: '2021',
    });

    await test.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );
  });
});
