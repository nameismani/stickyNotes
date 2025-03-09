import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

// Convert Unix timestamp (seconds) to dayjs object
export const getDateFromTimestamp = (timestamp: string | number) => {
  // Convert to number if it's a string
  const timeValue =
    typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;

  // Check if this is a Unix timestamp in seconds (10 digits) and convert to milliseconds if needed
  if (timeValue < 10000000000) {
    return dayjs(timeValue * 1000); // Convert seconds to milliseconds
  }

  // Already in milliseconds
  return dayjs(timeValue);
};

// Format the date using dayjs
export const formatDate = (timestamp: string | number) => {
  return getDateFromTimestamp(timestamp).format("MMM D, h:mm A");
};

// For relative time (like "2 hours ago")
export const getRelativeTime = (timestamp: string | number) => {
  return getDateFromTimestamp(timestamp).fromNow();
};

// Determine if note was updated recently (within 24 hours)
export const isRecentlyUpdated = (
  createdAt: string | number,
  updatedAt: string | number
) => {
  return (
    createdAt !== updatedAt &&
    dayjs().diff(getDateFromTimestamp(updatedAt), "hour") < 24
  );
};
