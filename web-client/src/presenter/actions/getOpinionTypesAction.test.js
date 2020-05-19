import { getOpinionTypesAction } from './getOpinionTypesAction';
import { runAction } from 'cerebral/test';

describe('getOpinionTypesAction', () => {
  it('returns a list of opinion document types', async () => {
    const result = await runAction(getOpinionTypesAction);
    expect(result.output).toEqual({
      opinionDocumentTypes: [
        'MOP - Memorandum Opinion',
        'Summary Opinion',
        'TCOP - T.C. Opinion',
      ],
    });
  });
});
