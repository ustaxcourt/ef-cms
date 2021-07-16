export const getMessages = ({ applicationContext }) =>
  applicationContext.getMessagingClient().getMessages({ applicationContext });
