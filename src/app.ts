import { createApp, createRouter, eventHandler } from 'h3';

import { deleteFileHandler } from './handlers/deleteFileHandler';
import { getFileHandler } from './handlers/getFileHandler';

export const app = createApp();

const router = createRouter()
  .get(
    '/',
    eventHandler(() => ({ ready: true, status: 200 })),
  )
  .get('/:id', eventHandler(getFileHandler))
  .delete('/:id', eventHandler(deleteFileHandler));

app.use(router);
