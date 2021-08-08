import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Note } from '../_models/note';
import { NoteService } from '../_services/note.service';
import { TodoDataService } from '../_services/todoDataService';

@Component({
  selector: 'note-edit',
  templateUrl: './note-edit.component.html',
  styleUrls: ['./note-edit.component.scss']
})
export class NoteEditComponent implements OnInit {
  @Input() note: Note;
  isListMode: boolean;

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService,
    private location: Location,
    private todoDataService: TodoDataService
  ) {}

  ngOnInit(): void {
    this.getNote();
  }

  get todos() {
    return this.todoDataService.getAllTodos();
  }

  getNote(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.noteService.getNote(id)
      .subscribe(note => {
        this.note = note;
        this.isListMode = this.note.list?.length > 0;
        this.todoDataService.setTodos(note.list);

      });
  }

  goBack(): void {
    this.location.back();
  }

  delete(): void {
    this.noteService.deleteNote(this.note)
      .subscribe(() => this.goBack());
  }

  save(): void {
    this.note.list = this.todoDataService.getAllTodos();
    this.noteService.updateNote(this.note)
      .subscribe(() => this.goBack());
  }

  onFileChanged(event) {
    this.noteService.getImageSrc(event).subscribe((imageSrc) => {this.note.image = imageSrc});
  }
  toggleTodoComplete(todo) {
    this.todoDataService.toggleTodoComplete(todo);
  }

  removeTodo(todo) {
    this.todoDataService.deleteTodoById(todo.id);
  }

}
