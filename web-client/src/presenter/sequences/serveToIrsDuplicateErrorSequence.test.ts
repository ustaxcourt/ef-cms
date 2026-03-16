import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { serveToIrsDuplicateErrorSequence } from './serveToIrsDuplicateErrorSequence';

describe('serveToIrsDuplicateErrorSequence', () => {
  let cerebralTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      serveToIrsDuplicateErrorSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  it('should set state.modal.showModal to ServeCaseToIrsDuplicateErrorModal', async () => {
    cerebralTest.setState('modal.showModal', false);

    await cerebralTest.runSequence('serveToIrsDuplicateErrorSequence', {
      showModal: 'ServeCaseToIrsDuplicateErrorModal',
    });

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ServeCaseToIrsDuplicateErrorModal',
    );
  });
});
