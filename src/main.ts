import { toNodeListener } from 'h3';
import { listen } from 'listhen';

import { app } from './app';
import { config } from './config';

const listener = toNodeListener(app);

listen(listener, {
  port: config.get('server.port'),
  hostname: config.get('server.host'),
}).catch(console.error);
