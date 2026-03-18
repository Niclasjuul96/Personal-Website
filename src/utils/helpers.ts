// Helper function to slice array
export const sliceArray = <T,>(
  array: T[],
  start: number,
  end?: number
): T[] => {
  return array.slice(start, end);
};

// Helper function to truncate text
export const truncate = (text: string, length: number): string => {
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

// Helper function to format date duration
export const formatDateRange = (startDate: string, endDate?: string): string => {
  if (!endDate) {
    return `${startDate} - Present`;
  }
  return `${startDate} - ${endDate}`;
};

// Helper function to group items by property
export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};
