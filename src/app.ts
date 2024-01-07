import { createApp, eventHandler } from 'h3';

export const app = createApp();

app.use(
  '/file/:id',
  eventHandler(() => 'Hello world!'),
);
