import { getFirestore } from './getFirestore';
import { memoize } from '../../utils/memoize';
import { HttpError } from '../../entities';

const getCollection = memoize(() =>
  getFirestore().collection('games'),
);

export async function getGames() {
  try {
    const result = await getCollection().get();
    return result.docs.map((snap) => snap.data());
  } catch (error) {
    throw new HttpError('Error while fetching games', 500);
  }
}
