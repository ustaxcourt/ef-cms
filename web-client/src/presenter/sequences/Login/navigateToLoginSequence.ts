export const navigateToLoginSequence = [
  ({ router }) => {
    router.externalRoute('http://localhost:5678/login');
  },
] as unknown as () => void;
