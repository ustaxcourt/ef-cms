exports.getMessages = ({ applicationContext }) =>
  applicationContext.getMessagingClient().getMessages({ applicationContext });
