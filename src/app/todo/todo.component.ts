import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { ApiService } from "../services/api.service";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent {
  title: any;
  description: any;

  constructor( public dialogRef: MatDialogRef<TodoComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private apiService: ApiService) {
  }

  onCancel() {
    this.dialogRef.close();
  }

  create() {
    this.dialogRef.afterClosed().subscribe(data => {
      this.apiService.createTodo(data.title, data.description).subscribe((result: any) => {
        this.apiService.todos.push(result);
      })
    });
    this.dialogRef.close({title: this.title, description: this.description});
  }
}
