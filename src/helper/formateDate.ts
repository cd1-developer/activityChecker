function formatDate(dateInfo: string) {
  const dateString = new Date(dateInfo);
  const date = dateString.getDate();
  const month = dateString.getMonth() + 1;
  const year = dateString.getFullYear();
  return `${date}/${month}/${year}`;
}
export default formatDate;
