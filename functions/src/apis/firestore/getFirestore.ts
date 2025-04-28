import type { Firestore } from 'firebase-admin/firestore';
import { getFirestore as createFirestore } from 'firebase-admin/firestore';
import { getApp } from '../firebase-admin/getApp.js';
import { memoize } from '../../utils/memoize.js';

export const getFirestore = memoize((): Firestore => createFirestore(getApp()));
