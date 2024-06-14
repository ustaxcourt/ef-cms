import { createApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';

async function main() {
  const applicationContext = createApplicationContext({});

  const idk = await applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {
      addedDocketNumbers: [],
      contentHtml: 'abc',
      docketNumber: '177-20',
      documentTitle: 'ORDER',
      eventCode: 'O',
    });

  console.log('Final output: ', idk);

  // const result = await applicationContext.getStorageClient().getObject({
  //   Bucket: 'exp4.ustc-case-mgmt.flexion.us-documents-exp4-us-east-1',
  //   Key: '00010ab1-7805-4972-a0c8-f3b554f22f91',
  // });

  // console.log(await result.Body?.transformToString())
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
