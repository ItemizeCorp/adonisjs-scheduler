import { FsLoader } from '@adonisjs/core/ace';
import { DateTime } from 'luxon';
import { arrayWrap } from './utils.js';
export class BaseSchedule {
    SUNDAY = 0;
    MONDAY = 1;
    TUESDAY = 2;
    WEDNESDAY = 3;
    THURSDAY = 4;
    FRIDAY = 5;
    SATURDAY = 6;
    expression = '0 * * * * *'; // seconds minutes hours dayOfMonth month dayOfWeek
    config = {
        tag: 'default',
        enabled: true,
        immediate: false,
        withoutOverlapping: false,
        expiresAt: 3600000,
        timezone: undefined,
    };
    beforeCallbacks = [];
    afterCallbacks = [];
    before(callback) {
        this.beforeCallbacks.push(callback);
        return this;
    }
    after(callback) {
        this.afterCallbacks.push(callback);
        return this;
    }
    timezone(timezone) {
        this.config.timezone = timezone;
        return this;
    }
    skip(state = true) {
        this.config.enabled = !state;
        return this;
    }
    tag(tag) {
        this.config.tag = tag;
        return this;
    }
    immediate(state = true) {
        this.config.immediate = state;
        return this;
    }
    withoutOverlapping(expiresAt = 3600000) {
        this.config.withoutOverlapping = true;
        this.config.expiresAt = expiresAt;
        return this;
    }
    everyMinutes(minutes) {
        return this.spliceIntoPosition(1, `*/${minutes}`);
    }
    everyMinute() {
        return this.spliceIntoPosition(1, '*');
    }
    everyTwoMinutes() {
        return this.everyMinutes(2);
    }
    everyThreeMinutes() {
        return this.everyMinutes(3);
    }
    everyFourMinutes() {
        return this.everyMinutes(4);
    }
    everyFiveMinutes() {
        return this.everyMinutes(5);
    }
    everyTenMinutes() {
        return this.everyMinutes(10);
    }
    everyFifteenMinutes() {
        return this.everyMinutes(15);
    }
    everyThirtyMinutes() {
        return this.everyMinutes(30);
    }
    hourly() {
        return this.spliceIntoPosition(1, 0);
    }
    hourlyAt(offset) {
        return this.hourBasedSchedule(offset, '*');
    }
    everyHours(hours, offset = 0) {
        return this.hourBasedSchedule(offset, `*/${hours}`);
    }
    everyOddHour(offset = 0) {
        return this.hourBasedSchedule(offset, '1-23/2');
    }
    everyTwoHours(offset = 0) {
        return this.everyHours(2, offset);
    }
    everyThreeHours(offset = 0) {
        return this.everyHours(3, offset);
    }
    everyFourHours(offset = 0) {
        return this.everyHours(4, offset);
    }
    everyFiveHours(offset = 0) {
        return this.everyHours(5, offset);
    }
    everySixHours(offset = 0) {
        return this.everyHours(6, offset);
    }
    daily() {
        return this.hourBasedSchedule(0, 0);
    }
    weekdays() {
        return this.spliceIntoPosition(5, '1-5');
    }
    weekends() {
        return this.spliceIntoPosition(5, '6,0');
    }
    mondays() {
        return this.days(1);
    }
    tuesdays() {
        return this.days(2);
    }
    wednesdays() {
        return this.days(3);
    }
    thursdays() {
        return this.days(4);
    }
    fridays() {
        return this.days(5);
    }
    saturdays() {
        return this.days(6);
    }
    sundays() {
        return this.days(0);
    }
    weekly() {
        return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, 0).spliceIntoPosition(5, 0);
    }
    weeklyOn(dayOfWeek = 1, time = '0:0') {
        this.dailyAt(time);
        return this.days(dayOfWeek);
    }
    monthly() {
        return this.spliceIntoPosition(1, 0).spliceIntoPosition(2, 0).spliceIntoPosition(3, 1);
    }
    quarterly() {
        return this.spliceIntoPosition(1, 0)
            .spliceIntoPosition(2, 0)
            .spliceIntoPosition(3, 1)
            .spliceIntoPosition(4, '1-12/3');
    }
    yearly() {
        return this.spliceIntoPosition(1, 0)
            .spliceIntoPosition(2, 0)
            .spliceIntoPosition(3, 1)
            .spliceIntoPosition(4, 1);
    }
    yearlyOn(month = 1, dayOfMonth = 1, time = '0:0') {
        this.dailyAt(time);
        return this.spliceIntoPosition(3, dayOfMonth).spliceIntoPosition(4, month);
    }
    everySecond() {
        return this.spliceIntoPosition(0, '*');
    }
    everySeconds(second) {
        return this.spliceIntoPosition(0, `*/${second}`);
    }
    everyFiveSeconds() {
        return this.everySeconds(5);
    }
    everyTenSeconds() {
        return this.everySeconds(10);
    }
    everyFifteenSeconds() {
        return this.everySeconds(15);
    }
    everyThirtySeconds() {
        return this.everySeconds(30);
    }
    cron(expression) {
        this.expression = expression;
        return this;
    }
    spliceIntoPosition(position, value) {
        const segements = this.expression.split(' ');
        segements[position] = String(value);
        this.cron(segements.join(' '));
        return this;
    }
    hourBasedSchedule(minutes, hours) {
        minutes = Array.isArray(minutes) ? minutes.join(',') : minutes;
        hours = Array.isArray(hours) ? hours.join(',') : hours;
        return this.spliceIntoPosition(1, minutes).spliceIntoPosition(2, hours);
    }
    days(days) {
        return this.spliceIntoPosition(5, Array.isArray(days) ? days.join(',') : days);
    }
    at(time) {
        return this.dailyAt(time);
    }
    dailyAt(time) {
        let segments = time.split(':');
        return this.hourBasedSchedule(segments.length === 2 ? Number(segments[1]) : '0', Number(segments[0]));
    }
    twiceDailyAt(first = 1, second = 13, offset = 0) {
        const hours = first + ',' + second;
        return this.hourBasedSchedule(offset, hours);
    }
    twiceDaily(first = 1, second = 13) {
        return this.twiceDailyAt(first, second, 0);
    }
    twiceMonthly(first = 1, second = 13, time = '0:0') {
        const dayOfMonth = first + ',' + second;
        this.dailyAt(time);
        return this.spliceIntoPosition(3, dayOfMonth);
    }
    lastDayOfMonth(time = '0:0') {
        this.dailyAt(time);
        return this.spliceIntoPosition(3, DateTime.now().endOf('month').day);
    }
    monthlyOn(dayOfMonth = 1, time = '0:0') {
        this.dailyAt(time);
        return this.spliceIntoPosition(3, dayOfMonth);
    }
    getExpression() {
        return this.expression;
    }
}
export class ScheduleCommand extends BaseSchedule {
    type = 'command';
    commandName;
    commandArgs;
    constructor(commandName, commandArgs = []) {
        super();
        this.commandName = commandName;
        this.commandArgs = commandArgs;
    }
}
export class ScheduleCallback extends BaseSchedule {
    type = 'callback';
    callback;
    constructor(callback) {
        super();
        this.callback = callback;
    }
}
export class Scheduler {
    app;
    SUNDAY = 0;
    MONDAY = 1;
    TUESDAY = 2;
    WEDNESDAY = 3;
    THURSDAY = 4;
    FRIDAY = 5;
    SATURDAY = 6;
    constructor(app) {
        this.app = app;
        this.app = app;
    }
    static __decorator_schedules = [];
    items = [];
    onStartingCallback;
    onStartedCallback;
    onBootCallback;
    async boot() {
        await this.onBootCallback?.();
        const fsLoader = new FsLoader(this.app.commandsPath());
        await fsLoader.getMetaData();
        for (const command of this.app.rcFile.commands) {
            const loader = await (typeof command === 'function' ? command() : command);
            await loader.getMetaData();
        }
        if (!Scheduler.__decorator_schedules || Scheduler.__decorator_schedules.length === 0)
            return;
        this.items.push(...Scheduler.__decorator_schedules);
    }
    command(name, args = []) {
        let newCommand = new ScheduleCommand(typeof name === 'string' ? name : name.commandName, arrayWrap(args));
        this.items.push(newCommand);
        return newCommand;
    }
    call(callback) {
        let newCommand = new ScheduleCallback(callback);
        this.items.push(newCommand);
        return newCommand;
    }
    withoutOverlapping(callback, config = { expiresAt: 3600000 }) {
        const lastLength = this.items.length;
        callback();
        const currentLength = this.items.length;
        const newItems = this.items.slice(lastLength, currentLength);
        for (const item of newItems) {
            item.withoutOverlapping(config.expiresAt);
        }
    }
    withTag(callback, tag) {
        const lastLength = this.items.length;
        callback();
        const currentLength = this.items.length;
        const newItems = this.items.slice(lastLength, currentLength);
        for (const item of newItems) {
            item.tag(tag);
        }
    }
    onStarting(callback) {
        this.onStartingCallback = callback;
    }
    onStarted(callback) {
        this.onStartedCallback = callback;
    }
    onBoot(callback) {
        this.onBootCallback = callback;
    }
}
