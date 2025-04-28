import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-user-management-dashboard',
  templateUrl: './user-management-dashboard.component.html',
  styleUrls: ['./user-management-dashboard.component.scss'],
})
export class UserManagementDashboardComponent implements OnInit {
  userDetails: any = [];
  constructor(
    private router: Router,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.displayUserDetails();
    this.dataService.updateUserTable$.subscribe(() => {
      this.displayUserDetails();
    });
  }
  toggleModal() {
    this.dataService.toggleModal();
  }

  //Getting status of the edit mode
  getEditMode() {
    return this.dataService.getEditState();
  }

  onEditUserDetails(index: number) {
    const userDetailsToEdit = this.userDetails[index];
    this.dataService.setEditUserDetails(userDetailsToEdit, index);
  }

  logOut() {
    this.authService.logout();
  }

  displayUserDetails() {
    this.dataService.getUsersFromDb().subscribe({
      next: (userDetails: any) => {
        this.dataService.userDetails = userDetails;
        this.userDetails = userDetails;

      },
      error: (err) => {
        console.error('Error Fetching users: ', err);
      },
    });
  }

  deleteUser(index: number) {
    this.dataService
      .deleteUser(this.dataService.userDetails[index].id)
      .subscribe({
        next: () => {
          this.displayUserDetails();
          this.dataService.triggerUpdateUserTable();
          console.log('User deleted successfully');
          
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        },
      });
  }
}
