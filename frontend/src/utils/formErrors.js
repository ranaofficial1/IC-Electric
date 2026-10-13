// Backend validation failures (422) come back as
// { message, details: [{ field, message }, ...] } — this turns that array
// into a { field: message } map so forms can show errors inline per input.
export function detailsToFieldErrors(details) {
  if (!Array.isArray(details)) return {};
  return Object.fromEntries(details.map((d) => [d.field, d.message]));
}
