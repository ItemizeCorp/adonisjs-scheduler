var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, cliHelpers, flags } from '@adonisjs/core/ace';
import { CronExpressionParser } from 'cron-parser';
import { DateTime } from 'luxon';
import stringWidth from 'string-width';
export default class SchedulerCommand extends BaseCommand {
    static commandName = 'scheduler:list';
    static description = '';
    static options = {
        startApp: true,
    };
    async run() {
        const schedule = await this.app.container.make('scheduler');
        await schedule.boot();
        const items = [];
        for (let index = 0; index < schedule.items.length; index++) {
            const command = schedule.items[index];
            if (this.tag && command.config.tag !== this.tag) {
                continue;
            }
            const commandName = command.type === 'callback'
                ? `Closure #${index + 1}`
                : `node ace ${command.commandName}` +
                    (command.commandArgs.length
                        ? ` ${this.ui.colors.cyan(command.commandArgs.join(' '))}`
                        : '');
            let nextDueDate = null;
            if (!command.config.enabled) {
                nextDueDate = 'Disabled';
            }
            else {
                const cron = CronExpressionParser.parse(command.expression, {
                    tz: command.config.timezone,
                });
                nextDueDate = DateTime.fromJSDate(cron.next().toDate()).toRelative();
            }
            items.push({
                expression: ` ${this.ui.colors.yellow(command.expression)} `,
                commandName: ` ${commandName} `,
                nextDueDate: this.ui.colors.dim(` Next Due: ${nextDueDate}`),
            });
        }
        const expressions = items.map((item) => item.expression);
        const largestExpressionLength = Math.max(...expressions.map((e) => stringWidth(e)));
        const formattedExpressions = cliHelpers.justify(expressions, {
            maxWidth: largestExpressionLength,
        });
        const commands = items.map((item) => item.commandName);
        const largestCommandLength = Math.max(...commands.map((e) => stringWidth(e)));
        const formattedCommands = cliHelpers.justify(commands, {
            maxWidth: largestCommandLength,
            paddingChar: this.ui.colors.dim('.'),
        });
        const dates = items.map((item) => item.nextDueDate);
        const largestDateLength = cliHelpers.TERMINAL_SIZE - (largestExpressionLength + largestCommandLength) - 10;
        const formattedDates = cliHelpers.truncate(cliHelpers.justify(dates, {
            maxWidth: largestDateLength,
            align: 'right',
            paddingChar: this.ui.colors.dim('.'),
        }), {
            maxWidth: largestDateLength,
        });
        for (let index = 0; index < formattedExpressions.length; index++) {
            const expression = formattedExpressions[index];
            const command = formattedCommands[index];
            const date = formattedDates[index];
            this.logger.log(`${expression}${command}${date}`);
        }
    }
}
__decorate([
    flags.string({ description: 'Filter by tag' })
], SchedulerCommand.prototype, "tag", void 0);
