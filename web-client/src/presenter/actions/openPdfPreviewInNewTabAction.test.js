import { openPdfPreviewInNewTabAction } from './openPdfPreviewInNewTabAction';
import { runAction } from 'cerebral/test';

describe('openPdfPreviewInNewTabAction', () => {
  const openMock = jest.fn();

  beforeEach(() => {
    global.window.open = openMock;
  });

  it('should open the pdfUrl from props in a new tab', () => {
    runAction(openPdfPreviewInNewTabAction, {
      props: { pdfUrl: 'http://www.example.com' },
    });

    expect(openMock).toBeCalled();
    expect(openMock).toBeCalledWith('http://www.example.com', '_blank');
  });
});
