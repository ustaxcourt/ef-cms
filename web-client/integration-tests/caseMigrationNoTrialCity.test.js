import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { loginAs, setupTest } from './helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);

const cerebralTest = setupTest();

describe('migrated case that is missing a preferred trial city journey', () => {
  let seededDocketNumber;
  beforeAll(() => {
    jest.setTimeout(30000);
    seededDocketNumber = '1338-20';
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');

  it('verify the case is blocked because it has a deadline', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: seededDocketNumber,
    });

    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: cerebralTest.getState(),
    });

    expect(headerHelper.showBlockedTag).toBeTruthy();
  });

  it('remove the deadline and verify the case is no longer blocked', async () => {
    cerebralTest.setState(
      'form.caseDeadlineId',
      'ad1ddb24-f3c4-47b4-b10e-76d1d050b2ab',
    );

    await cerebralTest.runSequence('deleteCaseDeadlineSequence', {
      docketNumber: seededDocketNumber,
    });

    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: cerebralTest.getState(),
    });

    expect(headerHelper.showBlockedTag).toBeFalsy();
  });
});
