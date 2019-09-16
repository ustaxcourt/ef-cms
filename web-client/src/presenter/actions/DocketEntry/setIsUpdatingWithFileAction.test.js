import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setIsUpdatingWithFileAction } from './setIsUpdatingWithFileAction';

describe('setIsUpdatingWithFileAction', () => {
  it('should set store.isUpdatingWithFile to true if a file is being attached to a previously-created docket entry', async () => {
    const result = await runAction(setIsUpdatingWithFileAction, {
      modules: {
        presenter,
      },
      state: {
        documentId: '123',
        form: {
          primaryDocumentFile: {
            name: 'testfile.pdf',
            size: 100,
          },
        },
      },
    });

    expect(result.state.isUpdatingWithFile).toBeTruthy();
  });

  it('should set store.isUpdatingWithFile to false if a file is being attached to a new docket entry', async () => {
    const result = await runAction(setIsUpdatingWithFileAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          primaryDocumentFile: {
            name: 'testfile.pdf',
            size: 100,
          },
        },
      },
    });

    expect(result.state.isUpdatingWithFile).toBeFalsy();
  });

  it('should set store.isUpdatingWithFile to false if a file is NOT being attached to a new docket entry', async () => {
    const result = await runAction(setIsUpdatingWithFileAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(result.state.isUpdatingWithFile).toBeFalsy();
  });

  it('should set store.isUpdatingWithFile to false if a file is NOT being attached to a previously-created docket entry', async () => {
    const result = await runAction(setIsUpdatingWithFileAction, {
      modules: {
        presenter,
      },
      state: {
        documentId: '123',
        form: {},
      },
    });

    expect(result.state.isUpdatingWithFile).toBeFalsy();
  });
});
