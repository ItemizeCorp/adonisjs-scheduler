import { ScheduleCommand, Scheduler } from './scheduler.js';
import { arrayWrap } from './utils.js';
export function schedule(expression, args = []) {
    return function (target) {
        if (typeof expression === 'string') {
            Scheduler.__decorator_schedules.push(new ScheduleCommand(target.commandName, arrayWrap(args)).cron(expression));
        }
        else {
            Scheduler.__decorator_schedules.push(expression(new ScheduleCommand(target.commandName, arrayWrap(args))));
        }
        return target;
    };
}
