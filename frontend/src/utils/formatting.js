export const getDate = (date) => {
  const handleshowtime = (s, m, h, d) => {
    if (h >= 24) {
      return `${d.toFixed(2)} days `;
    }
    if (m >= 60) {
      return `${h.toFixed(2)} hours `;
    }
    if (m > 1 && m < 60) {
      return `${m.toFixed(2)} minutes `;
    }
    if (m < 1) {
      return `${s.toFixed(2)} seconds `;
    }
  };
  if (date && date.createdAt) {
    const currentTime = new Date();
    const messageTime = new Date(date.createdAt);
    const timeDifference = currentTime - messageTime;
    const secondsAgo = timeDifference / 1000;
    const mintuesAgo = timeDifference / (1000 * 60);
    const hoursAgo = timeDifference / (1000 * 60 * 60);
    const daysAgo = timeDifference / (1000 * 60 * 60 * 24);
    return handleshowtime(secondsAgo, mintuesAgo, hoursAgo, daysAgo);
  }
  return null;
};
