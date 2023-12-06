import { handlePractitionerInformationTabSelectAction } from './handlePractitionerInformationTabSelectAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('handlePractitionerInformationTabSelectAction', () => {
  let documentationStub;
  let detailsStub;

  beforeEach(() => {
    documentationStub = jest.fn();
    detailsStub = jest.fn();

    presenter.providers.path = {
      details: detailsStub,
      documentation: documentationStub,
    };
  });

  it('should call path.documentation when documentations tab is selected', async () => {
    await runAction(handlePractitionerInformationTabSelectAction, {
      modules: {
        presenter,
      },
      props: { tabName: 'practitioner-documentation' },
    });

    expect(documentationStub).toHaveBeenCalled();
  });

  it('should call path.details when details tab is selected', async () => {
    await runAction(handlePractitionerInformationTabSelectAction, {
      modules: {
        presenter,
      },
      props: { tabName: 'details' },
    });

    expect(detailsStub).toHaveBeenCalled();
  });
});
