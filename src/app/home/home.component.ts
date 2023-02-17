import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSelectChange } from '@angular/material/select';
import { ApiService } from '../services/api.service';
import { TodoComponent } from '../todo/todo.component';
import { SocketService } from "../socket/socket.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  filteredTodos: any[]=[];
  Message: any;
  Data:any;

  constructor(private apiService: ApiService,
              private dialog: MatDialog,
              public socketService:SocketService) {
    socketService.getData();
  }

  ngOnInit(): void {
   this.apiService.getAllTodos().subscribe((todos) => {
      this.apiService.todos=todos;
      this.filteredTodos = todos;
    })
  }

  // tslint:disable-next-line:typedef
  filterChanged(ev: MatSelectChange) {
    const value = ev.value;
    this.filteredTodos = this.apiService.todos;
    if (value) {
      this.filteredTodos = this.filteredTodos.filter(t => t.status === value);
      //console.log(this.filteredTodos);
    } else {
      this.filteredTodos = this.apiService.todos;
    }
  }

/*  addTodo(todo:any){
    this.apiService.todos.push(todo);
    this.filteredTodos = this.apiService.todos;
  }*/
  // tslint:disable-next-line:typedef
  openDialog() {
    const dialogRef = this.dialog.open(TodoComponent, {
      width: '500px',
      hasBackdrop: true,
      role: 'dialog',
      height: '500px'
    });
    dialogRef.afterClosed().subscribe(data => {
      this.filteredTodos= this.apiService.todos;
    });
  }

  // tslint:disable-next-line:typedef

  openDeleteDialog(enterAnimationDuration: string, exitAnimationDuration: string, todoId:number): void {
    const dialog = this.dialog.open(DeleteDialog, {
      data:{id:todoId},
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialog.afterClosed().subscribe(async data => {
      this.filteredTodos = this.apiService.todos;
    });
  }

  // tslint:disable-next-line:typedef
  statusChanged(ev: MatSelectChange, todoId: number, index: number) {
    const value = ev.value;
    this.apiService.updateStatus(value, todoId).subscribe(todo => {
      this.apiService.todos[index]=todo;
      this.filteredTodos = this.apiService.todos;
    });
  }

  // tslint:disable-next-line:typedef

  async Sent() {
    await this.socketService.registerConsumerEvents(this.Message);
    this.Message='';
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'DeleteDialog.html',
})
export class DeleteDialog {
  constructor(public dialog: MatDialogRef<DeleteDialog>,
              private apiService: ApiService,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  delete(id: number) {
     this.dialog.afterClosed().subscribe( data =>{
       this.apiService.deleteTodo(id).subscribe(res => {
        if (res.success) {
          this.apiService.todos = this.apiService.todos.filter((t: any) => t.id !== id);
        }}
      )
    })
    this.dialog.close({ id: id });
  }
}
