import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { removePetitionerFromCaseAction } from './removePetitionerFromCaseAction';
import { runAction } from 'cerebral/test';

describe('removePetitionerFromCaseAction', () => {
  let successStub;

  const mockContact = {
    address1: '123 cat lane',
    contactId: 'b3d03c56-6c5a-4623-9857-40dafd260560',
    name: 'Selena Kyle',
  };

  beforeAll(() => {
    successStub = jest.fn();

    presenter.providers.applicationContext = applicationContextForClient;
    presenter.providers.path = {
      success: successStub,
    };
  });

  it('should set the success message of `Petitioner removed.`', async () => {
    const form = {
      contact: mockContact,
    };

    const { output } = await runAction(removePetitionerFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        form,
        modal: {
          caseCaption: 'A test caption',
        },
      },
    });

    expect(output.alertSuccess.message).toBe('Petitioner removed.');
  });
});
