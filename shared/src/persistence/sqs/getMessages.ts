export const getMessages = ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}) =>
  applicationContext.getMessagingClient().getMessages({ applicationContext });
