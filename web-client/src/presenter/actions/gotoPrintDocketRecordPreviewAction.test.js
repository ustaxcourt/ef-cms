import { applicationContext } from '../../applicationContext';
import { gotoPrintDocketRecordPreviewAction } from './gotoPrintDocketRecordPreviewAction';

import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const routeMock = jest.fn();
const openInNewTabMock = jest.fn();

describe('gotoPrintDocketRecordPreviewAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      openInNewTab: openInNewTabMock,
      route: routeMock,
    };
  });

  it('should use default values and open the pdf in a new view if no props are passed', async () => {
    await runAction(gotoPrintDocketRecordPreviewAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        currentPage: 'fakePage',
        pdfPreviewUrl: 'example.com',
      },
    });
    expect(routeMock).toHaveBeenCalled();
  });

  it('should open the pdf in a new view if props.openNewView is true', async () => {
    await runAction(gotoPrintDocketRecordPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        openNewTab: false,
        openNewView: true,
      },
      state: {
        currentPage: 'fakePage',
        pdfPreviewUrl: 'example.com',
      },
    });
    expect(routeMock).toHaveBeenCalled();
  });

  it('should open the pdf in a new window/tab if props.openNewTab is true', async () => {
    const result = await runAction(gotoPrintDocketRecordPreviewAction, {
      modules: {
        presenter,
      },
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
    expect(openInNewTabMock).toHaveBeenCalled();
  });
});
