import { UserData } from '../../../entities/user-data'

export class ExistingUserError extends Error {
  constructor (userData: UserData) {
    super('User ' + userData.email + ' already registered.')
  }
}
