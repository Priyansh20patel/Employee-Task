import { UserDto } from '../../shared/models/userDto';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  userList: UserDto[] = [];
  userEditForm!: FormGroup;     // edit form
  selectedUser: UserDto | null = null;  // edited data 
  originalUserData: UserDto | null = null; // cancel data

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadForm();
    this.authService.getUsers().subscribe((data) => {
      this.userList = data;
    });
  }

  loadForm() {
    this.userEditForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], 
      gender: ['', [Validators.required]],
      address: ['', [Validators.minLength(10)]],
    });
  }
  
  get formControls() {
    return this.userEditForm.controls;
  }
  
  // Edit
  editUser(user: UserDto) {
    this.selectedUser = { ...user };        // copy user
    this.originalUserData = { ...user };     
    this.userEditForm.patchValue(user);        // edit particular value
  }

  //  Save 
  saveUser() {
    if (this.userEditForm.valid && this.selectedUser) {
      const updatedUser = { ...this.selectedUser, ...this.userEditForm.value };
  
      this.authService.updateUser(updatedUser).subscribe(() => {
        this.userList = this.userList.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        );
  
        this.toastr.success('User updated successfully!', 'Success');
        this.cancelEdit();
      });
    }
  }
  

  cancelEdit() {
    this.selectedUser = null;
    this.userEditForm.reset();
  }

  // Delete
  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(id).subscribe(() => {
        this.userList = this.userList.filter((user) => user.id !== id);
        this.toastr.error('Deleted successfully!', 'Deleted');
      });
    }
  }
}
