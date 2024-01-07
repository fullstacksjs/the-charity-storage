import { createApp, createRouter, eventHandler } from 'h3';

import { getFile } from './handlers/getFile';

export const app = createApp();

const router = createRouter().get('/:id', eventHandler(getFile));

app.use(router);
