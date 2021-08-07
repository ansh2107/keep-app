import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NoteService } from '../_services/note.service';

@Component({
  selector: 'note-create',
  templateUrl: './note-create.component.html',
  styleUrls: ['./note-create.component.scss']
})
export class NoteCreateComponent implements OnInit {
  @Output() addedNote = new EventEmitter();
  public noteTitle: string;
  public noteDescription: string;
  selectedFile: File
  noteImageSrc: string

  constructor(private noteService: NoteService) { }


  onFileChanged(event) {
    this.noteService.getImageSrc(event).subscribe((imageSrc) => {this.noteImageSrc = imageSrc});
  }

  onSubmit() {
    const newNote = {
      title: this.noteTitle,
      description: this.noteDescription,
      image: this.noteImageSrc
    };
    this.addedNote.emit(newNote);

    this.noteTitle = '';
    this.noteDescription = '';
  }

  ngOnInit() {
  }
}
