import type { BaseCommand } from '@adonisjs/core/ace';
import { ScheduleCommand } from './scheduler.js';
export declare function schedule(expression: string | ((s: ScheduleCommand) => ScheduleCommand), args?: string | string[]): <T extends typeof BaseCommand>(target: T) => T;
