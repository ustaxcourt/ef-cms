import { CerebralTest } from 'cerebral/test';
import FormData from 'form-data';
import assert from 'assert';

import presenter from '../presenter';
import applicationContext from '../applicationContexts/dev';

let test;
const docketNumber = '103-18';

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
  fakeFile.name = 'fakeFile.pdf';

  describe('Initiate case', () => {
    it('Submits successfully', async () => {
      await test.runSequence('gotoCaseDetailSequence', { docketNumber });
      await test.runSequence('updateDocumentValueSequence', {
        key: 'file',
        value: fakeFile,
      });
      await test.runSequence('updateDocumentValueSequence', {
        key: 'documentType',
        value: 'Answer',
      });
      await test.runSequence('submitDocumentSequence');
      assert.deepEqual(test.getState('alertSuccess'), {
        title: 'Your Answer was uploaded successfully.',
        message: 'Your document has been filed.',
      });
    });
  });
});
