import { UseCase, UserData } from '@/use-cases/ports'

export class ErrorThrowingUseCaseStub implements UseCase {
  async perform (request: UserData): Promise<void> {
    throw Error()
  }
}
