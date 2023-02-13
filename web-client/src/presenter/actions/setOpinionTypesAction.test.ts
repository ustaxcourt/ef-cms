import { runAction } from 'cerebral/test';
import { setOpinionTypesAction } from './setOpinionTypesAction';

describe('setOpinionTypesAction', () => {
  it('sets state.opinionDocumentTypes from props', async () => {
    const opinionDocumentTypes = [
      'MOP - Memorandum Opinion',
      'Summary Opinion',
      'T.C. Opinion',
    ];

    const result = await runAction(setOpinionTypesAction, {
      props: { opinionDocumentTypes },
      state: {
        opinionDocumentTypes: [],
      },
    });

    expect(result.state.opinionDocumentTypes).toEqual(opinionDocumentTypes);
  });
});
