import { Component } from '@angular/core';
import { UserDto } from 'src/app/shared/models/userDto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ageValidator } from 'src/app/shared/models/age.validator';
import { Router } from '@angular/router';
import { SortColumnEnum } from 'src/app/shared/models/SortColumnEnum';
import { FontAwesomeIcons } from 'src/app/shared/models/fontawesome-icons.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  SortColumnEnum = SortColumnEnum;

  // All Users
  userList: UserDto[] = [];
  icons = FontAwesomeIcons;
  // Edit
  userEditForm!: FormGroup;
  selectedUser: UserDto | null = null;
  originalUserData: UserDto | null = null;

  // Pagination
  paginatedUsers: UserDto[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalUsers = 0;

  // Filters
  selectedStatus = 'All';
  searchText = '';

  // Sorting
  sortColumn: SortColumnEnum | null = null;
  sortDirection: 'asc' | 'desc' | null = null;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.authService.getUsers().subscribe((data) => {
      this.userList = data;
      this.updatePage();
    });
  }

  // ************************************************ Form Handling ************************************************

  loadForm(userData?: UserDto): void {
    this.userEditForm = this.fb.group({
      firstName: [userData?.firstName || '', [Validators.required, Validators.minLength(5)]],
      lastName: [userData?.lastName || '', [Validators.required, Validators.minLength(5)]],
      email: [
        userData?.email || '',
        [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)],
      ],
      phone: [
        userData?.phone || '',
        [Validators.required, Validators.pattern('^[0-9]{10}$'), Validators.maxLength(10)],
      ],
      dob: [userData?.dob || '', [Validators.required, ageValidator]],
      gender: [userData?.gender || '', [Validators.required]],
      address: [userData?.address || '', [Validators.required, Validators.minLength(10)]],
      status: [userData?.status || 'Active', [Validators.required]],
    });
  }

  get formControls() {
    return this.userEditForm.controls;
  }

  // ************************************************ Edit Handling ************************************************

  editUser(user: UserDto): void {
    this.selectedUser = { ...user };
    this.originalUserData = { ...user };
    this.userEditForm.patchValue(user);
  }

  saveUser(): void {
    if (this.userEditForm.valid && this.selectedUser) {
      const updatedUser: UserDto = { ...this.selectedUser, ...this.userEditForm.value };
      this.authService.updateUser(updatedUser).subscribe(() => {
        this.userList = this.userList.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        this.toastr.success('User updated successfully!', 'Success');
        this.cancelEdit();
        this.updatePage();
      });
    }
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.userEditForm.reset();
  }

  // ************************************************ Delete ************************************************

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(id).subscribe(() => {
        this.userList = this.userList.filter((user) => user.id !== id);
        this.toastr.success('Deleted successfully!', 'Deleted');
        this.updatePage();
      });
    }
  }

  // ************************************************ Filtering ************************************************

  get filteredUserList(): UserDto[] {
    let filtered = this.userList;

    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.phone.toString().includes(search)
      );
    }

    if (this.selectedStatus !== 'All') {
      filtered = filtered.filter(
        (user) => user.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

    return filtered;
  }

  // ************************************************ Sorting ************************************************

  sortTable(column: SortColumnEnum): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.updatePage();
  }

  sortUsers(users: UserDto[]): UserDto[] {
    if (!this.sortColumn || !this.sortDirection) return users;

    const column = this.sortColumn as SortColumnEnum;

    return users.slice().sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (column === 'dob') {
        const dateA = new Date(valueA as string).getTime();
        const dateB = new Date(valueB as string).getTime();
        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      const strA = valueA?.toString().toLowerCase() || '';
      const strB = valueB?.toString().toLowerCase() || '';
      return this.sortDirection === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }

  // ************************************************ Pagination ************************************************

  updatePage(): void {
    const filtered = this.filteredUserList;
    const sorted = this.sortUsers(filtered);
    this.totalUsers = sorted.length;

    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUsers = sorted.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    const totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.updatePage();
    }
  }


  // ************************************************ Logout ************************************************

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.setItem('authMessage', 'logout');
    this.router.navigate(['']);
  }
}
