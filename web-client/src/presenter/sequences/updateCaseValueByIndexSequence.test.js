import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('updateCaseValueByIndexSequence', () => {
  it('updates the expected key and index inside the caseDetail', async () => {
    test.setState('caseDetail', {
      keyName: [
        {
          subkeyName: 'André 3000',
        },
      ],
    });
    await test.runSequence('updateCaseValueByIndexSequence', {
      index: 0,
      key: 'keyName',
      subKey: 'subkeyName',
      value: 'Hey ya',
    });
    expect(test.getState('caseDetail')).toEqual({
      keyName: [
        {
          subkeyName: 'Hey ya',
        },
      ],
    });
  });
});
