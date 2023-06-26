import { runAction } from '@web-client/presenter/test.cerebral';
import { setSectionForMessageBoxAction } from './setSectionForMessageBoxAction';

describe('setSectionForMessageBoxAction', () => {
  it('sets state.messageBoxToDisplay.section from props', async () => {
    const mockSection = 'docket';
    const { state } = await runAction(setSectionForMessageBoxAction, {
      props: {
        section: mockSection,
      },
    });

    expect(state.messageBoxToDisplay.section).toEqual(mockSection);
  });
});
