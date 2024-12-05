import { UPIDetails } from './types';

export const generateUPILink = (details: UPIDetails): string => {
  return `upi://pay?pa=${details.vpa}&pn=${encodeURIComponent(
    details.name
  )}&am=${details.amount}&tn=${encodeURIComponent(details.transactionNote)}`;
};
