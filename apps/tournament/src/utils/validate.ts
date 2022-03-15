import { validate as uuidValidate, version as uuidVersion } from 'uuid';

export const uuidV4Validate = (uuid: string): boolean =>
  uuidValidate(uuid) && uuidVersion(uuid) === 4;