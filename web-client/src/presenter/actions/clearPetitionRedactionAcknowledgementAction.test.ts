import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { clearPetitionRedactionAcknowledgementAction } from '@web-client/presenter/actions/clearPetitionRedactionAcknowledgementAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearPetitionRedactionAcknowledgementAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should clear out petitionRedactionAcknowledgement if petition file is not present', async () => {
    const result = await runAction(
      clearPetitionRedactionAcknowledgementAction,
      {
        modules: {
          presenter,
        },
        state: {
          form: {
            petitionFile: undefined,
            petitionRedactionAcknowledgement: true,
          },
        },
      },
    );

    expect(result.state.form.petitionRedactionAcknowledgement).toBeUndefined();
  });

  it('should not clear out petitionRedactionAcknowledgement if petition file is present', async () => {
    const result = await runAction(
      clearPetitionRedactionAcknowledgementAction,
      {
        modules: {
          presenter,
        },
        state: {
          form: {
            petitionFile: {},
            petitionRedactionAcknowledgement: true,
          },
        },
      },
    );

    expect(result.state.form.petitionRedactionAcknowledgement).toEqual(true);
  });
});
