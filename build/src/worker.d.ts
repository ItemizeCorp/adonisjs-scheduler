import type { ApplicationService } from '@adonisjs/core/types';
import cron from 'node-cron';
export declare class Worker {
    app: ApplicationService;
    tasks: cron.ScheduledTask[];
    loaders: any[];
    booted: boolean;
    /**
     * Reusable Kernel instance - created once during boot() to prevent memory leaks.
     * Previously, a new Kernel was created on every scheduled execution which caused
     * CPU/memory to gradually increase over time.
     */
    private kernel;
    constructor(app: ApplicationService);
    boot(): Promise<void>;
    start(tag?: string): Promise<void>;
    stop(): Promise<void>;
}
