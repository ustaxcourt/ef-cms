import { CerebralTest } from 'cerebral/test';
import { JSDOM } from 'jsdom';
import assert from 'assert';

import mainModule from '../main';
import applicationContext from '../applicationContexts/dev';

const jsdom = new JSDOM('');
global.window = jsdom.window;
global.FormData = jsdom.window.FormData;
global.File = jsdom.window.File;

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

describe('Initiate case', () => {
  it('Submits successfully', async () => {
    await test.runSequence('gotoFilePetition');
    await test.runSequence('updatePetitionValue', {
      key: 'petitionFile',
      value: new File(['TEST'], 'petitionFile.pdf', {
        type: 'application/pdf',
      }),
    });
    await test.runSequence('updatePetitionValue', {
      key: 'requestForPlaceOfTrial',
      value: new File(['TEST'], 'requestForPlaceOfTrial.pdf', {
        type: 'application/pdf',
      }),
    });
    await test.runSequence('updatePetitionValue', {
      key: 'statementOfTaxpayerIdentificationNumber',
      value: new File(['TEST'], 'statementOfTaxpayerIdentificationNumber.pdf', {
        type: 'application/pdf',
      }),
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
