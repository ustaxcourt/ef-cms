import { getOpinionTypesAction } from './getOpinionTypesAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getOpinionTypesAction', () => {
  it('returns a list of opinion document types', async () => {
    const result = await runAction(getOpinionTypesAction);

    expect(result.output).toEqual({
      opinionDocumentTypes: [
        'Order of Service of Transcript (Bench Opinion)',
        'Memorandum Opinion',
        'Summary Opinion',
        'T.C. Opinion',
      ],
    });
  });
});
