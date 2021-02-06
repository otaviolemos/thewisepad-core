import { UserData } from '../../src/use-cases/ports/user-data'
import { NoteData } from '../../src/use-cases/ports/note-data'
import { UserBuilder } from './user-builder'

export class NoteBuilder {
  private readonly owner: UserData = UserBuilder.aUser().build()
  private readonly note: NoteData = {
    title: 'my note',
    content: 'my content',
    ownerEmail: this.owner.email,
    ownerId: this.owner.id,
    id: '0'
  }

  public static aNote (): NoteBuilder {
    return new NoteBuilder()
  }

  public withInvalidTitle (): NoteBuilder {
    this.note.title = ''
    return this
  }

  public withDifferentTitleAndId (): NoteBuilder {
    this.note.title = 'other title'
    this.note.id = '1'
    return this
  }

  public withDifferentTitleAndContent (): NoteBuilder {
    this.note.title = 'other title'
    this.note.content = 'other content'
    return this
  }

  public withUnregisteredOwner (): NoteBuilder {
    const unregisteredEmail = 'unregistered@mail.com'
    const unregisteredId = '10'
    this.owner.email = unregisteredEmail
    this.owner.id = unregisteredId
    this.note.ownerEmail = unregisteredEmail
    this.note.ownerId = unregisteredId
    return this
  }

  public build (): NoteData {
    return this.note
  }
}
