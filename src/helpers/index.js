import dayjs from "dayjs";
export const getTimeStr = (timestamp) => {
  return dayjs(timestamp).format("MMM D, YYYY h:mm:ss A");
};
