import { chooseMetaTypePathAction } from './chooseMetaTypePathAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('chooseMetaTypePathAction', () => {
  let courtIssuedStub;
  let documentStub;
  let noDocumentStub;

  beforeAll(() => {
    courtIssuedStub = jest.fn();
    documentStub = jest.fn();
    noDocumentStub = jest.fn();

    presenter.providers.path = {
      courtIssued: courtIssuedStub,
      document: documentStub,
      noDocument: noDocumentStub,
    };
  });

  it('should return the courtIssued path if state.screenMetadata.editType is CourtIssued', async () => {
    await runAction(chooseMetaTypePathAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: { editType: 'CourtIssued' },
      },
    });

    expect(courtIssuedStub).toHaveBeenCalled();
  });

  it('should return the document path if state.screenMetadata.editType is Document', async () => {
    await runAction(chooseMetaTypePathAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: { editType: 'Document' },
      },
    });

    expect(documentStub).toHaveBeenCalled();
  });

  it('should return the noDocument path if state.screenMetadata.editType is NoDocument', async () => {
    await runAction(chooseMetaTypePathAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: { editType: 'NoDocument' },
      },
    });

    expect(noDocumentStub).toHaveBeenCalled();
  });

  it('should return the noDocument path if state.screenMetadata.editType is empty', async () => {
    await runAction(chooseMetaTypePathAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(noDocumentStub).toHaveBeenCalled();
  });
});
