import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPractitionerDocumentAction } from './getPractitionerDocumentAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPractitionerDocumentAction', () => {
  const practitionerDocumentFileId = '7bbc668b-ee3f-4624-afc1-3bcbd6fe49fc';
  const barNumber = 'PT9876';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call getPractitionerDocumentInteractor with the correct bar number and document id', async () => {
    await runAction(getPractitionerDocumentAction, {
      modules: {
        presenter,
      },
      props: { barNumber, practitionerDocumentFileId },
    });

    expect(
      applicationContext.getUseCases().getPractitionerDocumentInteractor.mock
        .calls[0][1],
    ).toMatchObject({ barNumber, practitionerDocumentFileId });
  });
});
