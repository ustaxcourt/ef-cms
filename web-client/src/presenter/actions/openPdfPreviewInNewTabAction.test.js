import { openPdfPreviewInNewTabAction } from './openPdfPreviewInNewTabAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('openPdfPreviewInNewTabAction', () => {
  const openInNewTabMock = jest.fn();

  beforeAll(() => {
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
