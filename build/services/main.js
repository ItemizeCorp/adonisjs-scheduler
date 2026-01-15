import app from '@adonisjs/core/services/app';
let scheduler;
await app.booted(async () => {
    scheduler = await app.container.make("scheduler");
});
export { scheduler as default };
