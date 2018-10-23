import page from 'page';

const router = {
  initialize: app => {
    page('/', () => {
      app.getSequence('gotoHome')();
    });
    page('/file-a-petition', () => {
      app.getSequence('gotoFilePetition')();
    });
    page('/style-guide', () => {
      app.getSequence('gotoStyleGuide')();
    });
    page.start();
  },
};

export default router;
