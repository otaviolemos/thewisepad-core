import { User } from './user'
import { Note } from './note'
import { InvalidTitleError } from './errors/invalid-title-error'
import { left } from '../shared/either'

describe('Note entity', () => {
  test('should be created with a valid title and owner', () => {
    const validTitle = 'my note'
    const validEmail = 'my@mail.com'
    const validContent = 'content'
    const validOwner: User = User.create({ email: validEmail }).value as User
    const note: Note = Note.create(validOwner, validTitle, validContent).value as Note
    expect(note.title.value).toEqual('my note')
    expect(note.owner.email.value).toEqual('my@mail.com')
    expect(note.content).toEqual(validContent)
  })

  test('should not be created with invalid title', () => {
    const invalidTitle = ''
    const validEmail = 'my@mail.com'
    const validContent = 'content'
    const validOwner: User = User.create({ email: validEmail }).value as User
    expect(Note.create(validOwner, invalidTitle, validContent)).toEqual(left(new InvalidTitleError('')))
  })
})
