// Regex for IP address validation
const ipv4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
const ipv6 =
  /^(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}$|^(?:[A-Fa-f0-9]{1,4}:){1,7}:$|^:(?::[A-Fa-f0-9]{1,4}){1,7}$/;

// Validate IP address
export const isIP = (s: string) => ipv4.test(s) || ipv6.test(s);

// Row status for the table
export enum RowStatus {
  IDLE = "idle",
  LOADING = "loading",
  OK = "ok",
  ERROR = "error",
}

export type Row = {
  id: string;
  ip: string;
  country: string;
  flag?: string;
  timezone?: string;
  status: RowStatus;
  error: string;
  requestToken: number;
};

// Make a row for the table
export const makeRow = (id: string): Row => {
  return {
    id,
    ip: "",
    country: "",
    flag: "",
    timezone: "",
    status: RowStatus.IDLE,
    error: "",
    requestToken: 0,
  };
};
