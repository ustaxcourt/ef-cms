import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setPdfPreviewUrlAction } from './setPdfPreviewUrlAction';

presenter.providers.applicationContext = applicationContext;

describe('setPdfPreviewUrlAction', () => {
  it('sets the state.pdfPreviewUrl to the props.pdfUrl that was passed in', async () => {
    const result = await runAction(setPdfPreviewUrlAction, {
      props: { pdfUrl: '123' },
      state: {},
    });
    expect(result.state.pdfPreviewUrl).toEqual('123');
  });
});
