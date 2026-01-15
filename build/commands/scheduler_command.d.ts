import { BaseCommand } from '@adonisjs/core/ace';
import { CommandOptions } from '@adonisjs/core/types/ace';
import { Worker } from '../src/worker.js';
export default class SchedulerCommand extends BaseCommand {
    static commandName: string;
    static description: string;
    static aliases: string[];
    static options: CommandOptions;
    watch: boolean;
    tag: string;
    worker: Worker;
    prepare(): void;
    run(): Promise<void>;
    runAndWatch(): Promise<void>;
}
