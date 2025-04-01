import { UserDto } from '../../shared/models/userDto';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {

  userList: UserDto[] = [];
  editingUser: UserDto | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUsers().subscribe((data) => {
      this.userList = data;
      console.log(this.userList);
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(id).subscribe(() => {
        this.userList = this.userList.filter((user) => user.id !== id);
      });
    }
  }
}
