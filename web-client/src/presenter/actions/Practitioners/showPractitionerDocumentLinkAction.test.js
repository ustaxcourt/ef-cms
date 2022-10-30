import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { showPractitionerDocumentLinkAction } from './showPractitionerDocumentLinkAction';

describe('showPractitionerDocumentLinkAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should toggle the value of showPractitionerDocumentLink on the form', async () => {
    let { state } = await runAction(showPractitionerDocumentLinkAction, {
      modules: {
        presenter,
      },
      props: {
        showPractitionerDocumentLink: false,
      },
    });

    expect(state.form).toMatchObject({
      showPractitionerDocumentLink: false,
    });

    ({ state } = await runAction(showPractitionerDocumentLinkAction, {
      modules: {
        presenter,
      },
      props: {
        showPractitionerDocumentLink: true,
      },
    }));

    expect(state.form).toMatchObject({
      showPractitionerDocumentLink: true,
    });
  });
});
