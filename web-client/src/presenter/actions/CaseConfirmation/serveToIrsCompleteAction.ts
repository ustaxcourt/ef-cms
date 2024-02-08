// import { state } from '@web-client/presenter/app.cerebral';

/**
 * calls proxy endpoint to serve a case
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based upon if there was any paper service or all electronic service
 */
export const serveToIrsCompleteAction = async ({
  //   applicationContext,
  //   get,
  path,
  props,
}: ActionProps) => {
  const { pdfUrl } = props;

  if (pdfUrl) {
    return path.paper({ pdfUrl });
  }

  return path.electronic();
};
