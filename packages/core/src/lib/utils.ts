import * as uuid from 'uuid';

export function createId() {
  return uuid.v4();
}

export function assertNonNull(value: any, message: string) {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}
