import type { App } from 'firebase-admin/app';
import { initializeApp, getApps, getApp as getFirebaseApp, applicationDefault } from 'firebase-admin/app';
import { memoize } from '../../utils/memoize';

export const getApp = memoize((): App => {
  const apps = getApps();
  if (apps.length > 0) {
    return getFirebaseApp();
  }
  
  const projectId = 'demo-project';
  
  return initializeApp({
    projectId,
    credential: applicationDefault()
  });
});
