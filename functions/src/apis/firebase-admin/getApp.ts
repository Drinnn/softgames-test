import type { App } from 'firebase-admin/app';
import { initializeApp } from 'firebase-admin/app';
import { memoize } from '../../utils/memoize.js';

export const getApp = memoize((): App => {
  const app = initializeApp();
  return app;
});
