import { Scheduler } from '../src/scheduler.js';
export default class SchedulerProvider {
    app;
    constructor(app) {
        this.app = app;
    }
    boot() {
        this.app.container.singleton('scheduler', () => {
            return new Scheduler(this.app);
        });
    }
}
