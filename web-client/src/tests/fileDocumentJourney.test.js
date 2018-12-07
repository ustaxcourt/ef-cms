import { CerebralTest } from 'cerebral/test';
import FormData from 'form-data';
import assert from 'assert';

import mainModule from '../main';
import applicationContext from '../applicationContexts/dev';

let test;
const caseId = '3a6fb0fb-5f93-479a-9235-7eba43005800';

global.FormData = FormData;
mainModule.providers.applicationContext = applicationContext;
mainModule.providers.router = {
  route: () => {},
};

test = CerebralTest(mainModule);

describe.only('IRS Attorney', async () => {
  test.setState('user', {
    firstName: 'IRS',
    lastName: 'Attorney',
    role: 'irsattorney',
    token: 'irsattorney',
    userId: 'irsattorney',
  });

  const fakeFile = new Buffer(['TEST'], {
    type: 'application/pdf',
  });
  fakeFile.name = 'requestForPlaceOfTrial.pdf';

  describe('Initiate case', () => {
    it('Submits successfully', async () => {
      await test.runSequence('gotoFileDocument', { caseId });
      await test.runSequence('updateDocumentValue', {
        key: 'file',
        value: fakeFile,
      });
      await test.runSequence('submitDocument');
      assert.deepEqual(test.getState('alertSuccess'), {
        title: 'Your document was uploaded successfully.',
        message: 'Your document has been filed.',
      });
    });
  });
});
