import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../_models/user';
import { Note } from '../_models/note';

// array in local storage for registered users
const usersKey = 'keep-app';
const notesKey = 'keep-app-notes';
let users = JSON.parse(localStorage.getItem(usersKey) as string) || [];
let notes = JSON.parse(localStorage.getItem(notesKey) as string) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/notes/add') && method === 'POST':
                    return addNote();
                case url.endsWith('/notes/list') && method === 'POST':
                    return getNotes();
                case url.match('/notes') && method === 'PUT':
                    return updateNote();
                case url.match(/\/notes\/\d+$/) && method === 'GET':
                    return getNoteById();
                case url.match(/\/notes\/\d+$/) && method === 'DELETE':
                    return deleteNote();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find((x: { username: any; password: any; }) => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                ...basicDetails(user),
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (users.find((x: { username: any; }) => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = users.length ? Math.max(...users.map((x: { id: any; }) => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }


        function getNoteById() {
            if (!isLoggedIn()) return unauthorized();

            const note = notes.find((x: { id: number; }) => x.id === idFromUrl());
            return ok(note);
        }



        function updateNote() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let note = notes.find((x: { id: number; }) => x.id === params.id);

            // update and save note
            Object.assign(note, params);
            localStorage.setItem(notesKey, JSON.stringify(notes));

            return ok();
        }

        function deleteNote() {
            if (!isLoggedIn()) return unauthorized();

            notes = notes.filter((x: { id: number; }) => x.id !== idFromUrl());
            localStorage.setItem(notesKey, JSON.stringify(notes));
            return ok();
        }

        function addNote() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            params.Note.userId = params.userId;
            if (notes?.length > 0) {
                params.Note.id = genNoteId(notes);
                notes.push(params.Note);
            } else {
                notes = [];
                params.Note.id = genNoteId(notes);
                notes.push(params.Note);
            }

            // update and save user
            localStorage.setItem(notesKey, JSON.stringify(notes));

            return ok();
        }

        function getNotes() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let notesByUserId: Note[] = notes.filter((x: { userId: number; }) => x.userId === params.userId);
            return ok(notesByUserId);
        }

        function genNoteId(notes: Note[]): number {
            return notes.length > 0 ? Math.max(...notes.map(note => note.id)) + 1 : 11;
        }

        // helper functions

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message: string) {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorized' } })
                .pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(user: User) {
            const { id, username, firstName, lastName} = user;
            return { id, username, firstName, lastName};
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
