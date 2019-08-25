import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { stashDocketRecordHtmlAction } from './stashDocketRecordHtmlAction';

describe('stashDocketRecordHtmlAction', () => {
  it('should retrieve trial sessions', async () => {
    const result = await runAction(stashDocketRecordHtmlAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { caseId: 'okay' },
        contentHtml: 'abc',
      },
    });

    expect(result.output.caseHtml.okay).toEqual('abc');
  });
});
