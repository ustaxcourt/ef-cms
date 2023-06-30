import { runAction } from '@web-client/presenter/test.cerebral';
import { setPaperServicePartiesAction } from './setPaperServicePartiesAction';

describe('setPaperServicePartiesAction', () => {
  it('should not set showModal if paperServiceParties is an empty array and pdfUrl is defined', async () => {
    const result = await runAction(setPaperServicePartiesAction, {
      props: {
        paperServiceParties: [],
        pdfUrl: 'www.example.com',
      },
      state: {
        modal: {},
      },
    });

    expect(result.state.modal.showModal).toBeUndefined();
  });

  it('should not set showModal if paperServiceParties is not defined', async () => {
    const result = await runAction(setPaperServicePartiesAction, {
      props: { pdfUrl: 'www.example.com' },
      state: {
        modal: {},
      },
    });

    expect(result.state.modal.showModal).toBeUndefined();
  });

  it('should not set showModal if pdfUrl is not defined', async () => {
    const result = await runAction(setPaperServicePartiesAction, {
      props: { paperServiceParties: [{ yes: 'no' }] },
      state: {
        modal: {},
      },
    });

    expect(result.state.modal.showModal).toBeUndefined();
  });

  it('should set showModal if paperServiceParties is a non-empty array', async () => {
    const result = await runAction(setPaperServicePartiesAction, {
      props: {
        paperServiceParties: [{ yes: 'no' }],
        pdfUrl: 'www.example.com',
      },
      state: {
        modal: {},
      },
    });

    expect(result.state.modal.showModal).toEqual('PaperServiceConfirmModal');
  });
});
