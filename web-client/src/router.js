import page from 'page';

const router = {
  initialize: app => {
    page('/', () => {
      app.getSequence('gotoHome')();
    });
    page('/style-guide', () => {
      app.getSequence('gotoStyleGuide')();
    });
    page.start();
  },
};

export default router;
