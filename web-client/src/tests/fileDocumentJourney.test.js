import { CerebralTest } from 'cerebral/test';
import FormData from 'form-data';
import assert from 'assert';

import presenter from '../presenter';
import applicationContext from '../applicationContexts/dev';

let test;
const caseId = '3a6fb0fb-5f93-479a-9235-7eba43005800';

global.FormData = FormData;
presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  route: () => {},
};

test = CerebralTest(presenter);

describe('Respondent', async () => {
  test.setState('user', {
    firstName: 'Re',
    lastName: 'Spondent',
    role: 'respondent',
    token: 'respondent',
    userId: 'respondent',
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
