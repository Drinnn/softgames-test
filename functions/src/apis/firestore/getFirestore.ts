import type { Firestore } from 'firebase-admin/firestore';
import { getFirestore as createFirestore } from 'firebase-admin/firestore';
import { getApp } from '../firebase-admin/getApp';
import { memoize } from '../../utils/memoize';

export const getFirestore = memoize((): Firestore => createFirestore(getApp()));
