import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Note } from '../_models/note';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';
import { User } from '../_models/user';


@Injectable({ providedIn: 'root' })
export class NoteService {

  NotesUrl = `${environment.apiUrl}/notes`;
  user!: User;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.user = this.accountService.userValue;
   }

  /** GET Notes from the server */
  getNotes (userId: string): Observable<Note[]> {
    return this.http.post<Note[]>(`${this.NotesUrl}/list`, { userId });
  }

  /** GET Note by id. Will 404 if id not found */
  getNote(id: number): Observable<Note> {
    const url = `${this.NotesUrl}/${id}`;
    return this.http.get<Note>(url);
  }

  /* GET Notes whose title contains search term */
  searchNotes(term: string): Observable<Note[]> {
    if (!term.trim()) {
      // if not search term, return empty Note array.
      return of([]);
    }
    return this.http.get<Note[]>(`${this.NotesUrl}/?title=${term}`);
  }

  //////// Save methods //////////

  /** POST: add a new Note to the server */
  addNote (Note: Note, userId: string): Observable<Note> {
    return this.http.post<Note>(`${this.NotesUrl}/add`, { Note, userId});
  }

  /** DELETE: delete the Note from the server */
  deleteNote (Note: Note | number): Observable<Note> {
    const id = typeof Note === 'number' ? Note : Note.id;
    const url = `${this.NotesUrl}/${id}`;

    return this.http.delete<Note>(url);
  }

  /** PUT: update the Note on the server */
  updateNote (Note: Note): Observable<Note> {
    return this.http.put<Note>(this.NotesUrl, Note);
  }
}