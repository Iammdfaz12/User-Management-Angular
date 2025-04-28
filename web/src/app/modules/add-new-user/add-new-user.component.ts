import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss'],
})
export class AddNewUserComponent implements OnInit {
  addNewUserForm!: FormGroup;
  private editSub!: Subscription;
  showPassword: boolean = false;

  constructor(
    fb: FormBuilder,
    private dataService: DataService,
    private apiService: DataService
  ) {
    this.addNewUserForm = fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile_number: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.editSub = this.dataService.userDetailsUpdated$.subscribe(() => {
      if (this.dataService.getEditState()) {
        const editData = this.dataService.getEditUserDetails();
        this.prefillForm(editData.user);
      } else {
        this.addNewUserForm.reset();
      }
    });
    this.loadUser;
  }

  loadUser() {
    this.apiService.getUsersFromDb().subscribe({
      next: () => {
        console.log('Page is refreshed');
      },
      error: (error) => {
        console.log('Page is not refreshed');
      },
    });
  }

  prefillForm(userDetails: any) {
    this.addNewUserForm.patchValue({
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      email: userDetails.email,
      password: userDetails.password,
      mobile_number: userDetails.mobile_number,
    });
  }

  ngOnDestroy() {
    if (this.editSub) {
      this.editSub.unsubscribe();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getEditMode() {
    return this.dataService.getEditState();
  }

  toggleModal() {
    this.dataService.toggleModal();
    this.showPassword = false
    this.addNewUserForm.reset();
    this.dataService.setEditMode(false);
  }

  isModalOpen() {
    return this.dataService.getModalStatus();
  }

  onSubmit() {
    if (this.addNewUserForm.valid) {
      const userDetails = this.addNewUserForm.value;

      if (this.dataService.getEditState()) {
        const editData = this.dataService.getEditUserDetails();

        const id = editData.user.id;

        this.dataService.updateUserDetails(userDetails, id).subscribe({
          next: (res) => {
            this.dataService.setEditMode(false);
            this.dataService.triggerUpdateUserTable();
          },
          error: (err) => {
            console.error('Error updating user: ', err);
          },
        });
      } else {
        console.log('Form Submitted: ', userDetails);

        this.dataService.addNewUser(userDetails).subscribe({
          next: () => {
            this.dataService.triggerUpdateUserTable();
          },
          error: (err) => {
            console.error('Error adding user: ', err);
          },
        });
      }
    }
    this.toggleModal();
    this.addNewUserForm.reset();
    this.dataService.triggerUpdateUserTable();
  }
}
