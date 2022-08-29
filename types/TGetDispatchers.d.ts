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

type TMailDestination = {
  email: string;
};

interface ISendBulkTemplatedEmail {
  ({
    applicationContext,
    defaultTemplateData,
    destinations,
    templateName,
  }: {
    applicationContext: IApplicationContext;
    defaultTemplateData: TDefaultEmailTemplateData;
    destinations: TMailDestination[];
    templateName: string;
  });
}

type TGetDispatchers = {
  [key: string]: any;
  sendSlackNotification: ISendSlackNotification;
  sendBulkTemplatedEmail: ISendBulkTemplatedEmail;
};
