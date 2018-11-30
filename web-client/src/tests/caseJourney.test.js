import { CerebralTest, runCompute } from 'cerebral/test';
import FormData from 'form-data';
import assert from 'assert';
import {
  formattedCaseDetail,
  formattedCases,
} from '../main/computeds/formattedCaseDetail';

import { formattedSearchParams } from '../main/computeds/formattedSearchParams';
import mainModule from '../main';
import applicationContext from '../applicationContexts/dev';

let test;
let caseId;
global.FormData = FormData;
mainModule.providers.applicationContext = applicationContext;
mainModule.providers.router = {
  route: async url => {
    if (url === `/case-detail/${caseId}`) {
      await test.runSequence('gotoCaseDetail', { caseId });
    }
  },
};

test = CerebralTest(mainModule);

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
  fakeFile.name = 'requestForPlaceOfTrial.pdf';

  describe('Initiate case', () => {
    it('Submits successfully', async () => {
      await test.runSequence('gotoFilePetition');
      await test.runSequence('updatePetitionValue', {
        key: 'petitionFile',
        value: fakeFile,
      });

      await test.runSequence('updatePetitionValue', {
        key: 'requestForPlaceOfTrial',
        value: fakeFile,
      });
      await test.runSequence('updatePetitionValue', {
        key: 'statementOfTaxpayerIdentificationNumber',
        value: fakeFile,
      });
      await test.runSequence('submitFilePetition');
      assert.deepEqual(test.getState('alertSuccess'), {
        title: 'Your files were uploaded successfully.',
        message: 'Your case has now been created.',
      });
    });
  });

  describe('Dashboard', () => {
    it('View cases', async () => {
      await test.runSequence('gotoDashboard');
      assert.equal(test.getState('currentPage'), 'Dashboard');
      assert.ok(test.getState('cases').length > 0);
      caseId = test.getState('cases.0.caseId');
      assert.ok(caseId);
    });
  });

  describe('Case Detail', () => {
    it('View case', async () => {
      await test.runSequence('gotoCaseDetail', { caseId });
      assert.equal(test.getState('currentPage'), 'CaseDetail');
      assert.ok(test.getState('caseDetail'));
    });
  });
});

describe('formatted case details computed', () => {
  it('formats the docket number', () => {
    const result = runCompute(formattedCaseDetail, {
      state: { caseDetail: { docketNumber: '00101-18' } },
    });

    assert.equal(result.docketNumber, '101-18');
  });

  it('formats the docket number in a list of cases', () => {
    const result = runCompute(formattedCases, {
      state: { cases: [{ docketNumber: '00101-18' }] },
    });
    assert.equal(result[0].docketNumber, '101-18');
  });
});

describe('formatted search parameters computed', () => {
  it('formats a docket number search param', () => {
    const result = runCompute(formattedSearchParams, {
      state: { searchTerm: '101-18' },
    });

    assert.equal(result, '00101-18');
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
      await test.runSequence('gotoDashboard');
      assert.equal(test.getState('currentPage'), 'PetitionsWorkQueue');
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
      await test.runSequence('updateSearchTerm', { searchTerm: caseId });
      await test.runSequence('submitSearch');
      assert.equal(test.getState('caseDetail.caseId'), caseId);
      done();
    });
  });

  describe('Case Detail', () => {
    it('View case', async () => {
      test.setState('caseDetail', {});
      await test.runSequence('gotoCaseDetail', { caseId });
      assert.equal(test.getState('currentPage'), 'ValidateCase');
      assert.ok(test.getState('caseDetail'));
      await test.runSequence('toggleDocumentValidation', {
        item: test.getState('caseDetail').documents[0],
      });
      await test.runSequence('submitUpdateCase');
      await test.runSequence('toggleDocumentValidation', {
        item: test.getState('caseDetail').documents[1],
      });
      await test.runSequence('toggleDocumentValidation', {
        item: test.getState('caseDetail').documents[2],
      });
      await test.runSequence('submitUpdateCase');
    });
  });
});
