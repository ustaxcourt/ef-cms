import { applicationContext } from '../../applicationContext';
import { gotoPrintDocketRecordPreview } from './gotoPrintDocketRecordPreview';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

const windowOpenMock = jest.fn();

global.open = windowOpenMock;

global.window = {
  open: global.open,
};

describe('gotoPrintDocketRecordPreview', () => {
  it('should use default values and open the pdf in a new view if no props are passed', async () => {
    const result = await runAction(gotoPrintDocketRecordPreview, {
      props: {},
      state: {
        currentPage: 'fakePage',
        pdfPreviewUrl: 'example.com',
      },
    });
    expect(result.state.currentPage).toEqual('PrintableDocketRecord');
  });

  it('should open the pdf in a new view if props.openNewView is true', async () => {
    const result = await runAction(gotoPrintDocketRecordPreview, {
      props: {
        openNewTab: false,
        openNewView: true,
      },
      state: {
        currentPage: 'fakePage',
        pdfPreviewUrl: 'example.com',
      },
    });
    expect(result.state.currentPage).toEqual('PrintableDocketRecord');
  });

  it('should open the pdf in a new window/tab if props.openNewTab is true', async () => {
    const result = await runAction(gotoPrintDocketRecordPreview, {
      props: {
        openNewTab: true,
        openNewView: false,
      },
      state: {
        currentPage: 'fakePage',
        pdfPreviewUrl: 'example.com',
      },
    });
    expect(result.state.currentPage).toEqual('fakePage');
    expect(windowOpenMock).toHaveBeenCalled();
  });
});
