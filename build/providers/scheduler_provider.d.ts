import type { ApplicationService } from '@adonisjs/core/types';
import { Scheduler } from '../src/scheduler.js';
declare module '@adonisjs/core/types' {
    interface ContainerBindings {
        scheduler: Scheduler;
    }
}
export default class SchedulerProvider {
    protected app: ApplicationService;
    constructor(app: ApplicationService);
    boot(): void;
}
