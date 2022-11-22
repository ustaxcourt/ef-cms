export const openUrlInNewTab = ({ url }) => {
  setTimeout(() => {
    window.open(url, '_blank');
  });
};
