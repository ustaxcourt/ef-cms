import { openPdfPreviewInNewTabAction } from './openPdfPreviewInNewTabAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('openPdfPreviewInNewTabAction', () => {
  const openInNewTabMock = jest.fn();

  beforeEach(() => {
    presenter.providers.router = {
      openInNewTab: openInNewTabMock,
    };
  });

  it('should open the pdfUrl from props in a new tab', () => {
    runAction(openPdfPreviewInNewTabAction, {
      modules: {
        presenter,
      },
      props: { pdfUrl: 'http://www.example.com' },
    });

    expect(openInNewTabMock).toBeCalled();
    expect(openInNewTabMock).toBeCalledWith('http://www.example.com');
  });
});
