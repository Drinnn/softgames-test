import type { Firestore, Settings } from 'firebase-admin/firestore';
import { getFirestore as createFirestore } from 'firebase-admin/firestore';
import { getApp } from '../firebase-admin/getApp';
import { memoize } from '../../utils/memoize';

export const getFirestore = memoize((): Firestore => {
  const firestoreSettings: Settings = {
    ignoreUndefinedProperties: true
  };
  
  const firestore = createFirestore(getApp());
  firestore.settings(firestoreSettings);
  
  return firestore;
});
