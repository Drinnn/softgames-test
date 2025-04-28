const NOT_DEFINED = Symbol('notDefined');

export type MemoExtension = {
  reset(): void;
  isInitialized(): void;
  executionSuccessful(): boolean;
  inProgress(): boolean;
};

export type MemoizeOptions<T> = {
  initResult?: T | typeof NOT_DEFINED;
  resetAfterDone?: boolean;
};

export type Memo<T, K = undefined> = K extends undefined ? (() => T) & MemoExtension : ((key: K) => T) & MemoExtension;

type MemoGenericConstruct<T, K> = (key?: K) => T;

// See https://en.wikipedia.org/wiki/Memoization
export function memoize<T>(construct: () => T, options?: MemoizeOptions<T>): Memo<T>;
export function memoize<T, K>(construct: (key: K) => T, options?: MemoizeOptions<T>): Memo<T, K>;
export function memoize<T, K = never>(construct: MemoGenericConstruct<T, K>, options?: MemoizeOptions<T>): unknown {
  if (typeof construct !== 'function') {
    throw new Error(`Memoize construct function must be a function`);
  }
  const { resetAfterDone = false } = options || {};
  if (typeof resetAfterDone !== 'boolean') {
    throw new Error('Option "resetAfterDone" must be a boolean if provided');
  }
  let result: T | typeof NOT_DEFINED = options && 'initResult' in options && options.initResult !== undefined
    ? options.initResult
    : NOT_DEFINED;
  let success = false;
  let inProgress = false;
  const memo = (key?: K): T | typeof NOT_DEFINED => {
    if (result !== NOT_DEFINED) {
      return result;
    }
    success = false;
    inProgress = true;
    result = construct(key);
    if (!(result instanceof Promise)) {
      inProgress = false;
      success = true;
      if (resetAfterDone) {
        const tmpResult = result;
        result = NOT_DEFINED;
        return tmpResult;
      }
      return result;
    }
    result
      .then(() => {
        inProgress = false;
        success = true;
        if (resetAfterDone) {
          result = NOT_DEFINED;
        }
      })
      .catch(() => {
        inProgress = false;
        success = false;
        result = NOT_DEFINED;
      });
    return result;
  };
  memo.reset = (): void => {
    inProgress = false;
    success = false;
    result = NOT_DEFINED;
  };
  memo.notExecuted = (): boolean => result !== NOT_DEFINED;
  memo.wasLastExecutionSuccessful = (): boolean => success;
  memo.inProgress = (): boolean => inProgress;
  return memo;
}
