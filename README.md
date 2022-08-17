Workflow:
https://whimsical.com/honorous-betting-QyoBgmT5gY9jKosoAKQJwT

This is a backend project using mongodb, node.js for Honorous

Getting Started
First, run the development server:

npm start

or

yarn start

Running Cron job
```
ts-node src/cron/index.ts
```

Syncing with past events. This script will fill out the database without duplication
```angular2html
ts-node src/services/past_events_sync.ts
```
