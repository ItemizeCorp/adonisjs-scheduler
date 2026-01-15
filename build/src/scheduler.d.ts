import { BaseCommand } from '@adonisjs/core/ace';
import type { ApplicationService } from '@adonisjs/core/types';
type Range<START extends number, END extends number, ARR extends unknown[] = [], ACC extends number = never> = ARR['length'] extends END ? ACC | START | END : Range<START, END, [...ARR, 1], ARR[START] extends undefined ? ACC : ACC | ARR['length']>;
type DAYS = 0 | 1 | 2 | 3 | 4 | 5 | 6 | '0' | '1' | '2' | '3' | '4' | '5' | '6';
export declare abstract class BaseSchedule {
    SUNDAY: 0;
    MONDAY: 1;
    TUESDAY: 2;
    WEDNESDAY: 3;
    THURSDAY: 4;
    FRIDAY: 5;
    SATURDAY: 6;
    abstract type: string;
    expression: string;
    config: {
        tag: string;
        enabled: boolean;
        immediate: boolean;
        withoutOverlapping: boolean;
        expiresAt: number;
        timezone: string | undefined;
    };
    beforeCallbacks: (() => Promise<void>)[];
    afterCallbacks: (() => Promise<void>)[];
    before(callback: () => Promise<void>): this;
    after(callback: () => Promise<void>): this;
    timezone(timezone: string): this;
    skip(state?: boolean): this;
    tag(tag: string): this;
    immediate(state?: boolean): this;
    withoutOverlapping(expiresAt?: number): this;
    everyMinutes(minutes: number): this;
    everyMinute(): this;
    everyTwoMinutes(): this;
    everyThreeMinutes(): this;
    everyFourMinutes(): this;
    everyFiveMinutes(): this;
    everyTenMinutes(): this;
    everyFifteenMinutes(): this;
    everyThirtyMinutes(): this;
    hourly(): this;
    hourlyAt(offset: string | number | Range<0, 59> | Range<0, 59>[]): this;
    everyHours(hours: number, offset?: any[] | string | number): this;
    everyOddHour(offset?: any[] | string | number): this;
    everyTwoHours(offset?: any[] | string | number): this;
    everyThreeHours(offset?: any[] | string | number): this;
    everyFourHours(offset?: any[] | string | number): this;
    everyFiveHours(offset?: any[] | string | number): this;
    everySixHours(offset?: any[] | string | number): this;
    daily(): this;
    weekdays(): this;
    weekends(): this;
    mondays(): this;
    tuesdays(): this;
    wednesdays(): this;
    thursdays(): this;
    fridays(): this;
    saturdays(): this;
    sundays(): this;
    weekly(): this;
    weeklyOn(dayOfWeek?: Range<0, 7>, time?: string): this;
    monthly(): this;
    quarterly(): this;
    yearly(): this;
    yearlyOn(month?: number, dayOfMonth?: string | Range<1, 31>, time?: string): this;
    everySecond(): this;
    everySeconds(second: Range<1, 59>): this;
    everyFiveSeconds(): this;
    everyTenSeconds(): this;
    everyFifteenSeconds(): this;
    everyThirtySeconds(): this;
    cron(expression: string): this;
    protected spliceIntoPosition(position: number, value: string | number): this;
    protected hourBasedSchedule(minutes: string | number | Range<0, 59>[], hours: string | number | Range<0, 59>[]): this;
    days(days: DAYS | DAYS[]): this;
    at(time: string): this;
    dailyAt(time: string): this;
    twiceDailyAt(first?: Range<0, 23>, second?: Range<0, 23>, offset?: number): this;
    twiceDaily(first?: Range<0, 23>, second?: Range<0, 23>): this;
    twiceMonthly(first?: Range<1, 31>, second?: Range<1, 31>, time?: string): this;
    lastDayOfMonth(time?: string): this;
    monthlyOn(dayOfMonth?: Range<1, 31>, time?: string): this;
    getExpression(): string;
}
export declare class ScheduleCommand extends BaseSchedule {
    type: 'command';
    commandName: string;
    commandArgs: string[];
    constructor(commandName: string, commandArgs?: string[]);
}
export declare class ScheduleCallback extends BaseSchedule {
    type: 'callback';
    callback: Function;
    constructor(callback: Function);
}
export declare class Scheduler {
    protected app: ApplicationService;
    SUNDAY: 0;
    MONDAY: 1;
    TUESDAY: 2;
    WEDNESDAY: 3;
    THURSDAY: 4;
    FRIDAY: 5;
    SATURDAY: 6;
    constructor(app: ApplicationService);
    static __decorator_schedules: (ScheduleCallback | ScheduleCommand)[];
    items: (ScheduleCallback | ScheduleCommand)[];
    onStartingCallback?: ({ tag }: {
        tag: string;
    }) => void | Promise<void>;
    onStartedCallback?: ({ tag }: {
        tag: string;
    }) => void | Promise<void>;
    onBootCallback?: () => void | Promise<void>;
    boot(): Promise<void>;
    command(name: string | typeof BaseCommand, args?: string | string[]): ScheduleCommand;
    call(callback: Function): ScheduleCallback;
    withoutOverlapping(callback: () => void, config?: {
        expiresAt: number;
    }): void;
    withTag(callback: () => void, tag: string): void;
    onStarting(callback: ({ tag }: {
        tag: string;
    }) => void | Promise<void>): void;
    onStarted(callback: ({ tag }: {
        tag: string;
    }) => void | Promise<void>): void;
    onBoot(callback: () => void | Promise<void>): void;
}
export {};
