import type { H3Event } from 'h3';
import { createError, setResponseStatus } from 'h3';

import { getKey, getParam, s3 } from '../s3';

export async function deleteFileHandler(event: H3Event) {
  try {
    await s3.deleteObject(getParam(getKey(event.path)));
    setResponseStatus(event, 204);
    return { status: 204 };
  } catch (err) {
    throw createError({ status: 500, message: 'Something went wrong' });
  }
}
