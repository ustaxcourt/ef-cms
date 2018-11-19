import { CerebralTest } from 'cerebral/test';
import { JSDOM } from 'jsdom';
import assert from 'assert';

import mainModule from './';
import applicationContext from '../applicationContexts/mock';
import sinon from 'sinon';

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

    it('Toggles payment info content', async () => {
      await test.runSequence('togglePaymentDetails');
      assert.equal(test.getState('paymentInfo.showDetails'), true);
      await test.runSequence('togglePaymentDetails');
      assert.equal(test.getState('paymentInfo.showDetails'), false);
    });
  });

  describe('sequences', () => {
    it('log in success', async () => {
      await test.runSequence('gotoLogIn');
      assert.equal(test.getState('currentPage'), 'LogIn');
      await test.runSequence('updateFormValue', {
        key: 'name',
        value: 'petitionsclerk',
      });
      assert.equal(test.getState('form.name'), 'petitionsclerk');
      await test.runSequence('submitLogIn');
      assert.equal(test.getState('user.userId'), 'petitionsclerk');
      assert.equal(test.getState('user.role'), 'petitionsclerk');
    });

    it('log in success', async () => {
      await test.runSequence('gotoLogIn');
      assert.equal(test.getState('currentPage'), 'LogIn');
      await test.runSequence('updateFormValue', {
        key: 'name',
        value: 'taxpayer',
      });
      assert.equal(test.getState('form.name'), 'taxpayer');
      await test.runSequence('submitLogIn');
      assert.equal(test.getState('user.userId'), 'taxpayer');
      assert.equal(test.getState('user.role'), 'taxpayer');
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
      const localPersistenceGateway = applicationContext.getPersistenceGateway();
      sinon.spy(localPersistenceGateway, 'createCase');
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
      assert.ok(localPersistenceGateway.createCase.calledOnce);
      const caseDetails = localPersistenceGateway.createCase.getCall(0).args[1];
      assert.equal(caseDetails.petitionFileId, 'a');
      assert.equal(caseDetails.requestForPlaceOfTrialId, 'b');
      assert.equal(caseDetails.statementOfTaxpayerIdentificationNumberId, 'c');
    });

    it('View cases', async () => {
      await test.runSequence('gotoDashboard');
      assert.equal(test.getState('currentPage'), 'Dashboard');
      assert.equal(
        test.getState('cases.0.documents.0.documentId'),
        'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      );
    });

    it('View case detail', async () => {
      await test.runSequence('gotoCaseDetail');
      assert.equal(test.getState('currentPage'), 'CaseDetail');
      assert.equal(
        test.getState('caseDetail.documents.0.documentId'),
        'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      );
    });

    it('View petitions section work queue', async () => {
      test.setState('user', { name: 'petitionsclerk', role: 'petitionsclerk' });
      await test.runSequence('gotoDashboard');
      assert.equal(test.getState('currentPage'), 'PetitionsWorkQueue');
      assert.equal(
        test.getState('caseDetail.documents.0.documentId'),
        'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      );
    });

    it('Update case - goto case detail', async () => {
      test.setState('user', { name: 'petitionsclerk', role: 'petitionsclerk' });
      await test.runSequence('gotoCaseDetail');
      assert.equal(test.getState('currentPage'), 'ValidateCase');
      assert.equal(
        test.getState('caseDetail.documents.0.documentId'),
        'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      );
      await test.runSequence('updateCase');
    });

    it('Update case - set document as validated', async () => {
      test.setState('user', { name: 'petitionsclerk', role: 'petitionsclerk' });
      await test.runSequence('gotoCaseDetail');
      assert.equal(test.getState('currentPage'), 'ValidateCase');
      assert.equal(
        test.getState('caseDetail.documents.0.documentId'),
        'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      );
      test.setState('caseDetail.documents.0.validated', false);
      test.setState('caseDetail.documents.1.validated', true);
      test.setState('caseDetail.documents.2.validated', true);
      await test.runSequence('updateCase');
      assert.equal(test.getState('alertError.title'), 'Validate all documents');
      test.setState('caseDetail.documents.0.validated', true);
      test.setState('caseDetail.documents.1.validated', true);
      test.setState('caseDetail.documents.2.validated', true);
      await test.runSequence('updateCase');
      assert.equal(test.getState('alertSuccess.title'), 'Petition validated');
    });
  });
});
