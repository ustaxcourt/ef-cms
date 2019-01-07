import { CerebralTest } from 'cerebral/test';

import presenter from '../presenter';
import applicationContext from '../applicationContext';

presenter.providers.applicationContext = applicationContext;
const test = CerebralTest(presenter);

describe('Submit Document', async () => {
  it('should display an error alert when the document state is missing the documentType', async () => {
    test.setState('document', {});
    await test.runSequence('submitDocumentSequence');
    expect(test.getState('alertError')).toBeDefined();
    expect(test.getState('alertSuccess')).toBeNull();
  });

  it('should display an error alert when the documentType is "Select"', async () => {
    test.setState('document', {
      documentType: 'Select',
    });
    await test.runSequence('submitDocumentSequence');
    expect(test.getState('alertError')).toBeDefined();
    expect(test.getState('alertSuccess')).toBeNull();
  });

  it('should display an error alert when the file is null', async () => {
    test.setState('document', {
      documentType: 'Answer',
      file: null,
    });
    await test.runSequence('submitDocumentSequence');
    expect(test.getState('alertError')).toBeDefined();
    expect(test.getState('alertSuccess')).toBeNull();
  });
});
