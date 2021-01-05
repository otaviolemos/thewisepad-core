import { UserData } from '../../../src/entities/user-data'

export class UserBuilder {
  private user: UserData = {
    email: 'any@mail.com',
    password: '1validpassword',
    id: '0'
  }

  public static aUser (): UserBuilder {
    return new UserBuilder()
  }

  public withInvalidEmail (): UserBuilder {
    this.user.email = 'invalid_email'
    return this
  }

  public withInvalidPassword (): UserBuilder {
    this.user.password = '1abc'
    return this
  }

  public build (): UserData {
    return this.user
  }
}
