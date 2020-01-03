export const isodate = (date: Date) => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const msLocal =  date.getTime() - offsetMs;
    const dateLocal = new Date(msLocal);
    return dateLocal.toISOString().slice(0, 10);
}