import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
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

  const form = {
    contact: mockContact,
  };
  const mockDocketNumber = '123-20';

  const caseCaptionToUpdate = 'A test caption';

  beforeAll(() => {
    successStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      success: successStub,
    };
  });

  it('should set the success message of `Petitioner removed.`', async () => {
    const { output } = await runAction(removePetitionerFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        form,
        modal: {
          caseCaption: caseCaptionToUpdate,
        },
      },
    });

    expect(output.alertSuccess.message).toBe('Petitioner removed.');
    expect(output.tab).toBe('caseInfo');
  });

  it('should update the case caption', async () => {
    await runAction(removePetitionerFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        form,
        modal: {
          caseCaption: caseCaptionToUpdate,
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCaseContextInteractor.mock
        .calls[0][0].caseCaption,
    ).toBe(caseCaptionToUpdate);
  });

  it('should make a call to remove the petitioner from the case', async () => {
    await runAction(removePetitionerFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        form,
        modal: {
          caseCaption: caseCaptionToUpdate,
        },
      },
    });

    expect(
      applicationContext.getUseCases().removePetitionerFromCaseInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      contactId: mockContact.contactId,
      docketNumber: mockDocketNumber,
    });
  });
});
