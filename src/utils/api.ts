// IP lookup response type
export type IPLookupResponse = {
  country: string;
  flag: string;
  timezone: string;
};

// Get the timezone from the current time and timezone id
const getTimezone = (currentTime: string, timezoneId: string): string => {
  const timezone = new Date(currentTime);
  const formattedTime = timezone.toLocaleTimeString("en-US", {
    timeZone: timezoneId,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return formattedTime;
};

// IP lookup api call
export const fetchCountry = async (
  ip: string,
  signal: AbortSignal
): Promise<IPLookupResponse> => {
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal,
    });
    if (!res.ok) throw new Error(`Network error ${res.status}`);
    const data = await res.json();

    if (data && data.success) {
      const currentTime = data.timezone["current_time"];
      const timezoneId = data.timezone.id;
      const formattedTime = getTimezone(currentTime, timezoneId);

      return {
        country: data.country,
        flag: data.flag.img,
        timezone: formattedTime,
      };
    }
    throw new Error(data?.message || "Lookup failed");
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Lookup failed");
  }
};
