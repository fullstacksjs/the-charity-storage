import {
  createApp,
  createRouter,
  eventHandler,
  handleCors,
  readBody,
} from 'h3';

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
  .post(
    '/test',
    eventHandler(async (event) => {
      console.log(await readBody(event));
      return { body: 'Done' };
    }),
  )
  .delete('/:id', eventHandler(deleteFileHandler));

app.use(
  eventHandler((event) => {
    handleCors(event, {
      origin: '*',
      credentials: true,
      methods: '*',
    });
  }),
);

app.use(router);
