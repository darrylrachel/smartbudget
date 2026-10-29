import { isoDate, period, workspaceId, recordId } from './contracts';

export type PaySchedule = { workspaceId: string; id: string; anchor: string } & (
  { cadence: 'weekly' } | { cadence: 'biweekly' } |
  { cadence: 'monthly'; day: number } |
  { cadence: 'semimonthly'; days: readonly [number, number] }
);

// Forecast dates only: these occurrences never enter the cash snapshot.
export function paycheckDates(schedule: PaySchedule, range: ReturnType<typeof period>): readonly string[] {
  workspaceId(schedule.workspaceId); recordId(schedule.id); isoDate(schedule.anchor);
  period(range.start, range.endExclusive);
  const day = (n: number) => { if (!Number.isInteger(n) || n < 1 || n > 31) throw new Error('Scheduled day must be 1–31.'); };
  if (schedule.cadence === 'monthly') day(schedule.day);
  else if (schedule.cadence === 'semimonthly') {
    if (!Array.isArray(schedule.days) || schedule.days.length !== 2 || !Object.hasOwn(schedule.days, 0) || !Object.hasOwn(schedule.days, 1)) throw new Error('Choose two distinct ascending days.');
    day(schedule.days[0]); day(schedule.days[1]);
    if (schedule.days.length !== 2 || schedule.days[0] >= schedule.days[1]) throw new Error('Choose two distinct ascending days.');
  } else if (schedule.cadence !== 'weekly' && schedule.cadence !== 'biweekly') throw new Error('Invalid cadence.');
  const result: string[] = [];
  const anchorTime = Date.parse(`${schedule.anchor}T00:00:00Z`);
  // Enumerate calendar days, avoiding local-time/DST arithmetic and month drift.
  for (let time = Date.parse(`${range.start}T00:00:00Z`), end = Date.parse(`${range.endExclusive}T00:00:00Z`); time < end; time += 86400000) {
    const date = new Date(time).toISOString().slice(0, 10);
    if (date < schedule.anchor) continue;
    let matches: boolean;
    if (schedule.cadence === 'weekly' || schedule.cadence === 'biweekly') {
      matches = ((time - anchorTime) / 86400000) % (schedule.cadence === 'weekly' ? 7 : 14) === 0;
    } else {
      const year = Number(date.slice(0, 4)), month = Number(date.slice(5, 7));
      const last = new Date(`${date.slice(0, 7)}-28T00:00:00Z`);
      last.setUTCMonth(month); last.setUTCDate(0);
      const days = schedule.cadence === 'monthly' ? [schedule.day] : schedule.days;
      matches = year === last.getUTCFullYear() && days.some(n => Math.min(n, last.getUTCDate()) === Number(date.slice(8)));
    }
    if (matches) result.push(date); // Colliding clamped semimonthly dates represent one payday.
  }
  return result;
}
