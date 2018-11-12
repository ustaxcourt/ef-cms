import { CerebralTest } from 'cerebral/test';
import { JSDOM } from 'jsdom';
import assert from 'assert';

import mainModule from './';
import applicationContext from '../environments/dev';

mainModule.providers.applicationContext = applicationContext;
mainModule.providers.router = { route: () => {} };

const jsdom = new JSDOM('');
global.window = jsdom.window;
global.FormData = jsdom.window.FormData;

global.Blob = jsdom.window.Blob;

const test = CerebralTest(mainModule);

describe('Main cerebral module', () => {
  describe('routing', () => {
    it('Handles routing', async () => {
      await test.runSequence('gotoStyleGuide');
      assert.equal(test.getState('currentPage'), 'StyleGuide');
    });

    it('Handles routing to file petition', async () => {
      await test.runSequence('gotoFilePetition');
      assert.equal(test.getState('currentPage'), 'FilePetition');
    });

    it('Toggles USA Banner Content', async () => {
      await test.runSequence('toggleUsaBannerDetails');
      assert.equal(test.getState('usaBanner.showDetails'), true);
      await test.runSequence('toggleUsaBannerDetails');
      assert.equal(test.getState('usaBanner.showDetails'), false);
    });
  });

  describe('sequences', () => {
    it('log in success', async () => {
      await test.runSequence('gotoLogIn');
      assert.equal(test.getState('currentPage'), 'LogIn');
      await test.runSequence('updateFormValue', {
        key: 'name',
        value: 'Test, Taxpayer',
      });
      assert.equal(test.getState('form.name'), 'Test, Taxpayer');
      await test.runSequence('submitLogIn');
      assert.equal(test.getState('user'), 'Test, Taxpayer');
    });

    it('log in failure', async () => {
      await test.runSequence('gotoLogIn');
      assert.equal(test.getState('currentPage'), 'LogIn');
      await test.runSequence('updateFormValue', {
        key: 'name',
        value: 'Bad actor',
      });
      assert.equal(test.getState('form.name'), 'Bad actor');
      await test.runSequence('submitLogIn');
      assert.equal(test.getState('alertError.title'), 'User not found');
    });

    it('File PDF petition', async () => {
      await test.runSequence('gotoFilePetition');
      await test.runSequence('updatePetitionValue', {
        key: 'petitionFile',
        file: 'contents',
      });
      await test.runSequence('updatePetitionValue', {
        key: 'requestForPlaceOfTrial',
        file: 'contents',
      });
      await test.runSequence('updatePetitionValue', {
        key: 'statementOfTaxpayerIdentificationNumber',
        file: 'contents',
      });
      await test.runSequence('submitFilePetition');
      assert.deepEqual(test.getState('alertSuccess'), {
        title: 'Your files were uploaded successfully.',
        message: 'Your case has now been created.',
      });
    });

    it('View cases', async () => {
      await test.runSequence('gotoDashboard');
      assert.equal(test.getState('currentPage'), 'Dashboard');
      assert.equal(
        test.getState('cases.0.documents.0.documentId'),
        'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      );
    });

    // it('View case detail', async () => {
    //   await test.runSequence('gotoCaseDetail');
    //   assert.equal(test.getState('currentPage'), 'CaseDetail');
    //   assert.equal(
    //     test.getState('case.documents.0.documentId'),
    //     'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    //   );
    // });
  });
});
