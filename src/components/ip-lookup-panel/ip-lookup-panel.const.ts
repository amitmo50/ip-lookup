export const IP_LOOKUP_CONSTANTS = {
  // UI Text
  TITLE: "IP Lookup",
  DESCRIPTION: "Enter one or more IP addresses and get their country",
  ADD_BUTTON_TEXT: "Add",

  // Input
  IP_PLACEHOLDER: "e.g., 8.8.8.8 or 2001:4860:4860::8888",

  // Tooltips
  TOOLTIP_REMOVE_ROW:
    "Remove row, if it is row No.1 it will only clear the data of the first row",

  // Error Messages
  INVALID_IP_ERROR: "Invalid IP address",
  LOOKUP_FAILED_ERROR: "Lookup failed",
} as const;
