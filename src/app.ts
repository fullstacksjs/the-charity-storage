import { createApp, createRouter, eventHandler, handleCors } from 'h3';

import { deleteFileHandler } from './handlers/deleteFileHandler';
import { getFileHandler } from './handlers/getFileHandler';
import { uploadFileHandler } from './handlers/uploadFileHandler';

export const app = createApp();
const router = createRouter()
  .get(
    '/',
    eventHandler(() => ({ ready: true, status: 200 })),
  )
  .get('/:id', eventHandler(getFileHandler))
  .post('/', eventHandler(uploadFileHandler))
  .delete('/:id', eventHandler(deleteFileHandler));
app.use(
  eventHandler((event) =>
    handleCors(event, { origin: '*', credentials: true }),
  ),
);
app.use(router);
