import { UserData } from '@/use-cases/ports/user-data'

export class UserBuilder {
  private user: UserData = {
    email: 'any@mail.com',
    password: '1validpassword',
    id: '6057e9885c94f99b6dc1410a'
  }

  public static aUser (): UserBuilder {
    return new UserBuilder()
  }

  public withDifferentEmail (): UserBuilder {
    this.user.email = 'unregistered@mail.com'
    return this
  }

  public withInvalidEmail (): UserBuilder {
    this.user.email = 'invalid_email'
    return this
  }

  public withInvalidPassword (): UserBuilder {
    this.user.password = '1abc'
    return this
  }

  public withWrongPassword (): UserBuilder {
    this.user.password = 'wrongpassword'
    return this
  }

  public build (): UserData {
    return this.user
  }
}
