import { createTokenForExternalReference } from '@angular/compiler/src/identifiers';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Todo } from '../_models/todo';
import { NoteService } from '../_services/note.service';
import { TodoDataService } from '../_services/todoDataService';

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
  noteImageSrc: string;
  isListMode = false;
  newTodo: Todo = new Todo();

  constructor(private noteService: NoteService, private todoDataService: TodoDataService) { }


  onFileChanged(event) {
    this.noteService.getImageSrc(event).subscribe((imageSrc) => {this.noteImageSrc = imageSrc});
  }

  onSubmit() {
    const newNote = {
      title: this.noteTitle,
      description: this.noteDescription,
      image: this.noteImageSrc,
      list: this.todoDataService.getAllTodos()
    };
    this.addedNote.emit(newNote);

    this.noteTitle = '';
    this.noteDescription = '';
    this.noteImageSrc = '';
    this.todoDataService.resetTodos();
  }

  
  addTodo() {
    this.todoDataService.addTodo(this.newTodo);
    this.newTodo = new Todo();
  }

  toggleTodoComplete(todo) {
    this.todoDataService.toggleTodoComplete(todo);
  }

  removeTodo(todo) {
    this.todoDataService.deleteTodoById(todo.id);
  }

  get todos() {
    return this.todoDataService.getAllTodos();
  }

  ngOnInit() {
    this.todoDataService.resetTodos();
  }
}
