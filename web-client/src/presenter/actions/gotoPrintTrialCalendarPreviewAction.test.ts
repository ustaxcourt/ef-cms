import { gotoPrintTrialCalendarPreviewAction } from './gotoPrintTrialCalendarPreviewAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('gotoPrintTrialCalendarPreviewAction', () => {
  it('should set state.currentPage to PrintableTrialCalendar by default if no props are passed in', async () => {
    const result = await runAction(gotoPrintTrialCalendarPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        currentPage: 'SomethingElse',
      },
    });

    expect(result.state.currentPage).toEqual('PrintableTrialCalendar');
  });

  it('should set state.currentPage to PrintableTrialCalendar if props.openNewView is true', async () => {
    const result = await runAction(gotoPrintTrialCalendarPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        openNewView: true,
      },
      state: {
        currentPage: 'SomethingElse',
      },
    });

    expect(result.state.currentPage).toEqual('PrintableTrialCalendar');
  });

  it('should call the router openInNewTab function if props.openNewTab is true and props.openNewView is false', async () => {
    const openInNewTab = jest.fn();
    presenter.providers.router = { openInNewTab };

    await runAction(gotoPrintTrialCalendarPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        openNewTab: true,
        openNewView: false,
      },
      state: {
        pdfPreviewUrl: 'blob:12345',
      },
    });

    expect(openInNewTab).toHaveBeenCalledWith('blob:12345');
  });
});
