import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Note } from '../_models/note';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  @Input() note: Note;
  @Input() noteChange: Function;
  @Input() deleteNote: Function;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onDelete(): void {
    this.deleteNote(this.note);
  }


  toEditPage(): void {
    this.router.navigate([`/edit/${this.note.id}`]);
  }

}
