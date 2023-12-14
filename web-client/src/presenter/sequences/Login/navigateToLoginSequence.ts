export const navigateToLoginSequence = [
  ({ router }) => {
    router.externalRoute('http://localhost:1234/login');
  },
] as unknown as () => void;
