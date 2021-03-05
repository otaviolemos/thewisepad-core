import { User } from '@/entities/user'
import { Note } from '@/entities/note'

describe('Note entity', () => {
  test('should be created with a valid title and owner', () => {
    const validTitle = 'my note'
    const validEmail = 'my@mail.com'
    const validPassword = '1validpassword'
    const validContent = 'content'
    const validOwner: User = User.create(validEmail, validPassword).value as User
    const note: Note = Note.create(validOwner, validTitle, validContent).value as Note
    expect(note.title.value).toEqual('my note')
    expect(note.owner.email.value).toEqual('my@mail.com')
    expect(note.content).toEqual(validContent)
  })

  test('should not be created with invalid title', () => {
    const invalidTitle = ''
    const validEmail = 'my@mail.com'
    const validPassword = '1validpassword'
    const validContent = 'content'
    const validOwner: User = User.create(validEmail, validPassword).value as User
    const error: Error = Note.create(validOwner, invalidTitle, validContent).value as Error
    expect(error.name).toEqual('InvalidTitleError')
  })

  test('should be created with empty content if content is null', () => {
    const validTitle = 'my note'
    const validEmail = 'my@mail.com'
    const validPassword = '1validpassword'
    const nullContent = null
    const validOwner: User = User.create(validEmail, validPassword).value as User
    const note: Note = Note.create(validOwner, validTitle, nullContent).value as Note
    expect(note.title.value).toEqual('my note')
    expect(note.owner.email.value).toEqual('my@mail.com')
    expect(note.content).toEqual('')
  })

  test('should be created with empty content if content is undefined', () => {
    const validTitle = 'my note'
    const validEmail = 'my@mail.com'
    const validPassword = '1validpassword'
    const undefinedContent = undefined
    const validOwner: User = User.create(validEmail, validPassword).value as User
    const note: Note = Note.create(validOwner, validTitle, undefinedContent).value as Note
    expect(note.title.value).toEqual('my note')
    expect(note.owner.email.value).toEqual('my@mail.com')
    expect(note.content).toEqual('')
  })
})
