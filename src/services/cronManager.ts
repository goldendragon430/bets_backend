import cron from 'node-cron'

//hash map to map keys to jobs
const jobMap: Map<string, cron.ScheduledTask> = new Map();
const jobGroupsMap: Map<string, cron.ScheduledTask[]> = new Map();

