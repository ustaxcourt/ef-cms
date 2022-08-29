interface ISendSlackNotification {
  ({
    applicationContext,
    text,
    topic,
  }: {
    applicationContext: IApplicationContext;
    text: string;
    topic: string;
  }): Promise<string>;
}

interface ISendBulkTemplatedEmail {
  ({
    applicationContext,
    defaultTemplateData,
    destinations,
    templateName,
  }: {
    applicationContext: IApplicationContext;
    defaultTemplateData: TDefaultEmailTemplateData;
    destinations: string[];
    templateName: string;
  });
}

type TGetDispatchers = {
  [key: string]: any;
  sendSlackNotification: ISendSlackNotification;
  sendBulkTemplatedEmail: ISendBulkTemplatedEmail;
};
