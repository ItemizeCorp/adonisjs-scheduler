import { BaseCommand } from '@adonisjs/core/ace';
import { CommandOptions } from '@adonisjs/core/types/ace';
export default class SchedulerCommand extends BaseCommand {
    static commandName: string;
    static description: string;
    tag?: string;
    static options: CommandOptions;
    run(): Promise<void>;
}
