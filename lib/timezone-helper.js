export function getUtcDate(dateStr, timeStr, timezone) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  
  const utcDateDummy = new Date(Date.UTC(year, month - 1, day, hour, minute));
  
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  
  const parts = formatter.formatToParts(utcDateDummy);
  const partVal = (type) => parts.find((p) => p.type === type).value;
  
  const localYear = Number(partVal("year"));
  const localMonth = Number(partVal("month"));
  const localDay = Number(partVal("day"));
  const localHour = Number(partVal("hour"));
  const localMinute = Number(partVal("minute"));
  
  const formattedUtc = Date.UTC(localYear, localMonth - 1, localDay, localHour, localMinute);
  const offset = formattedUtc - utcDateDummy.getTime();
  
  return new Date(utcDateDummy.getTime() - offset);
}

export function formatTimeInTimezones(dateStr, hh, mm, ap, sourceTimezone, country) {
  if (!dateStr || !hh || !mm || !ap) {
    const rawTime = [hh, mm].filter(Boolean).join(":") + (ap ? ` ${ap}` : "");
    return {
      success: false,
      local: rawTime || "TBD",
      india: "TBD",
      egypt: "TBD",
    };
  }

  let hour = parseInt(hh, 10);
  const minute = parseInt(mm, 10);
  if (ap === "PM" && hour < 12) hour += 12;
  if (ap === "AM" && hour === 12) hour = 0;

  const time24 = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  
  let tz = sourceTimezone;
  if (!tz) {
    const countryKey = (country || "").trim().toLowerCase();
    const tzMap = {
      "united states": "America/New_York",
      "us": "America/New_York",
      "usa": "America/New_York",
      "canada": "America/Toronto",
      "united kingdom": "Europe/London",
      "uk": "Europe/London",
      "australia": "Australia/Sydney",
      "saudi arabia": "Asia/Riyadh",
      "united arab emirates": "Asia/Dubai",
      "uae": "Asia/Dubai",
      "qatar": "Asia/Qatar",
      "kuwait": "Asia/Kuwait",
      "bahrain": "Asia/Bahrain",
      "oman": "Asia/Muscat",
      "egypt": "Africa/Cairo",
      "india": "Asia/Kolkata",
      "pakistan": "Asia/Karachi",
      "bangladesh": "Asia/Dhaka",
      "malaysia": "Asia/Kuala_Lumpur",
      "singapore": "Asia/Singapore",
      "indonesia": "Asia/Jakarta",
      "germany": "Europe/Berlin",
      "france": "Europe/Paris",
      "italy": "Europe/Rome",
      "spain": "Europe/Madrid",
    };
    tz = tzMap[countryKey] || "UTC";
  }

  try {
    const actualDate = getUtcDate(dateStr, time24, tz);

    const formatOpts = { hour: "numeric", minute: "numeric", hour12: true };
    const dateOpts = { month: "short", day: "numeric" };

    const localFormatter = new Intl.DateTimeFormat("en-US", { timeZone: tz, ...formatOpts });
    const indiaFormatter = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", ...formatOpts });
    const egyptFormatter = new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Cairo", ...formatOpts });

    const localDateFormatter = new Intl.DateTimeFormat("en-US", { timeZone: tz, ...dateOpts });
    const indiaDateFormatter = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", ...dateOpts });
    const egyptDateFormatter = new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Cairo", ...dateOpts });

    const localTimeFormatted = localFormatter.format(actualDate);
    const indiaTimeFormatted = indiaFormatter.format(actualDate);
    const egyptTimeFormatted = egyptFormatter.format(actualDate);

    const localDateStr = localDateFormatter.format(actualDate);
    const indiaDateStr = indiaDateFormatter.format(actualDate);
    const egyptDateStr = egyptDateFormatter.format(actualDate);

    const indiaDateSuffix = indiaDateStr !== localDateStr ? ` on ${indiaDateStr}` : "";
    const egyptDateSuffix = egyptDateStr !== localDateStr ? ` on ${egyptDateStr}` : "";

    return {
      success: true,
      local: `${localTimeFormatted} (${country || "Local"} Time - ${tz})`,
      india: `${indiaTimeFormatted} (India Time${indiaDateSuffix})`,
      egypt: `${egyptTimeFormatted} (Egypt Time${egyptDateSuffix})`,
    };
  } catch (err) {
    console.error("Timezone conversion helper failed:", err);
    const rawTime = [hh, mm].filter(Boolean).join(":") + (ap ? ` ${ap}` : "");
    return {
      success: false,
      local: `${rawTime} (${country || "Local"} Time)`,
      india: "Conversion failed",
      egypt: "Conversion failed",
    };
  }
}
