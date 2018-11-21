import { CerebralTest } from 'cerebral/test';
import FormData from 'form-data';
import assert from 'assert';

import mainModule from '../main';
import applicationContext from '../applicationContexts/dev';

global.FormData = FormData;

mainModule.providers.applicationContext = applicationContext;
mainModule.providers.router = { route: () => {} };

const test = CerebralTest(mainModule);

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
    // assert.equal(test.getState('cases'), []);
  });
});
