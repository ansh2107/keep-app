import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Note } from '../_models/note';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { NoteService } from '../_services/note.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public notes: Note[] = [];
  private user!: User;
  private subscriptions = new Subscription();
  constructor(
    private accountService: AccountService,
    private noteService: NoteService,
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnDestroy(): void {
   this.subscriptions?.unsubscribe();
  }

  ngOnInit() {
    this.notes = [];
    this.subscriptions.add(this.accountService.user.subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.subscriptions.add(this.noteService.getNotes(user.id).subscribe((notes) => { 
          this.notes = notes; 
        }));
      }
    }));
  }

  addedNote(newNote: Note): void {
    this.noteService.addNote(newNote, this.user.id)
      .subscribe(() => { this.notes = this.notes.concat(newNote);});    
  }

  deleteNote = (note: Note): void => {
    this.notes = this.notes.filter(n => n !== note);
    this.noteService.deleteNote(note)
      .subscribe();
  }

  noteChange = (note: Note): void => {
    const currentNote = this.notes.find((currentNote) => currentNote.id === note.id);
    const noteIndex = this.notes.indexOf(currentNote);
    const newNotes = [...this.notes];
    newNotes[noteIndex] = note;
    this.notes = newNotes;

    this.noteService.updateNote(note)
      .subscribe();
  };
}
