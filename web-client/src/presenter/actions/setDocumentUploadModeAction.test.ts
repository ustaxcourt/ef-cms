import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocumentUploadModeAction } from './setDocumentUploadModeAction';

describe('setDocumentUploadModeAction', () => {
  it('sets state.currentViewMetadata.documentUploadMode to the passed in props.documentUploadMode', async () => {
    const result = await runAction(setDocumentUploadModeAction(), {
      props: {
        documentUploadMode: 'something',
      },
    });

    expect(result.state.currentViewMetadata.documentUploadMode).toEqual(
      'something',
    );
  });

  it('sets state.currentViewMetadata.documentUploadMode to the passed in value when props.documentUploadMode is undefined', async () => {
    const result = await runAction(
      setDocumentUploadModeAction('something else'),
      {
        props: {
          documentUploadMode: undefined,
        },
      },
    );

    expect(result.state.currentViewMetadata.documentUploadMode).toEqual(
      'something else',
    );
  });
});
