import { CerebralTest } from 'cerebral/test';
import assert from 'assert';
import FormData from 'form-data';

import presenter from '../presenter';
import applicationContext from '../applicationContexts/dev';

let test;
let docketNumber;
global.FormData = FormData;
presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  route: async url => {
    if (url === `/case-detail/${docketNumber}`) {
      await test.runSequence('gotoCaseDetailSequence', { docketNumber });
    }
  },
};

test = CerebralTest(presenter);

describe('Tax payer', async () => {
  test.setState('user', {
    firstName: 'Test',
    lastName: 'Taxpayer',
    role: 'taxpayer',
    token: 'taxpayer',
    userId: 'taxpayer',
  });

  const fakeFile = new Buffer(['TEST'], {
    type: 'application/pdf',
  });
  fakeFile.name = 'fakeFile.pdf';

  describe('Initiate case', () => {
    it('Submits successfully', async () => {
      await test.runSequence('gotoFilePetitionSequence');
      await test.runSequence('updatePetitionValueSequence', {
        key: 'petitionFile',
        value: fakeFile,
      });
      await test.runSequence('updatePetitionValueSequence', {
        key: 'requestForPlaceOfTrial',
        value: fakeFile,
      });
      await test.runSequence('updatePetitionValueSequence', {
        key: 'statementOfTaxpayerIdentificationNumber',
        value: fakeFile,
      });
      await test.runSequence('submitFilePetitionSequence');
      assert.deepEqual(test.getState('alertSuccess'), {
        title: 'Your files were uploaded successfully.',
        message: 'Your case has now been created.',
      });
    });
  });

  describe('Dashboard', () => {
    it('View cases', async () => {
      await test.runSequence('gotoDashboardSequence');
      assert.equal(test.getState('currentPage'), 'DashboardPetitioner');
      assert.ok(test.getState('cases').length > 0);
      docketNumber = test.getState('cases.0.docketNumber');
      assert.ok(docketNumber);
    });
  });

  describe('Case Detail', () => {
    it('View case', async () => {
      await test.runSequence('gotoCaseDetailSequence', { docketNumber });
      assert.equal(test.getState('currentPage'), 'CaseDetailPetitioner');
      assert.ok(test.getState('caseDetail'));
    });
  });
});

describe('Petitions clerk', () => {
  describe('Dashboard', () => {
    it('View cases', async () => {
      test.setState('user', {
        firstName: 'Petitions',
        lastName: 'Clerk',
        role: 'petitionsclerk',
        token: 'petitionsclerk',
        userId: 'petitionsclerk',
      });
      await test.runSequence('gotoDashboardSequence');
      assert.equal(test.getState('currentPage'), 'DashboardPetitionsClerk');
      assert.ok(test.getState('cases').length > 0);
    });
  });

  describe('Search box', async () => {
    it('takes us to case details', async done => {
      test.setState('user', {
        firstName: 'Petitions',
        lastName: 'Clerk',
        role: 'petitionsclerk',
        token: 'petitionsclerk',
        userId: 'petitionsclerk',
      });
      test.setState('caseDetail', {});
      await test.runSequence('updateSearchTermSequence', {
        searchTerm: docketNumber,
      });
      await test.runSequence('submitSearchSequence');
      assert.equal(test.getState('caseDetail.docketNumber'), docketNumber);
      done();
    });
  });

  describe('Case Detail', () => {
    it('View case', async () => {
      test.setState('caseDetail', {});
      await test.runSequence('gotoCaseDetailSequence', { docketNumber });
      assert.equal(test.getState('currentPage'), 'CaseDetailInternal');
      assert.ok(test.getState('caseDetail'));
      await test.runSequence('submitUpdateCaseSequence');
      await test.runSequence('submitToIrsSequence');
    });
  });
});
