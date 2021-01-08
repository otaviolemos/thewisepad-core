import { UserData } from '../../ports/user-data'

export class ExistingUserError extends Error {
  constructor (userData: UserData) {
    super('User ' + userData.email + ' already registered.')
  }
}
