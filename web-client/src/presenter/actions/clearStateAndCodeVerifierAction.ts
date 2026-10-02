export const clearStateAndCodeVerifierAction = ({
  applicationContext,
}: ActionProps) => {
  applicationContext.getPersistenceGateway().removeItem({ key: 'auth_state' });
  applicationContext
    .getPersistenceGateway()
    .removeItem({ key: 'code_verifier' });
};
