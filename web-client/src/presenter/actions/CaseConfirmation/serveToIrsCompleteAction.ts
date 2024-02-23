export const serveToIrsCompleteAction = ({ path, props }: ActionProps) => {
  const { pdfUrl } = props;

  if (pdfUrl) {
    return path.paper({ pdfUrl });
  }

  return path.electronic();
};
