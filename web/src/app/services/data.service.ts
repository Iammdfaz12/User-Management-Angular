import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  addUserModal: boolean = false;
  editMode: boolean = false;
  userDetails: any = [];
  selectedUser: any = null;
  selectedUserIndex: number | null = null;
  private userDetailsUpdated = new Subject<void>();
  userDetailsUpdated$ = this.userDetailsUpdated.asObservable();

  private updateUserTable = new Subject<void>();
  updateUserTable$ = this.updateUserTable.asObservable();

  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  triggerUpdateUserTable() {
    this.updateUserTable.next();
  }

  toggleModal() {
    this.addUserModal = !this.addUserModal;
    if (!this.addUserModal && this.editMode) {
      //reset the edit state(task inputs)
      this.resetEditState();
    }
  }

  getModalStatus() {
    return this.addUserModal;
  }

  setEditMode(editMode: boolean) {
    this.editMode = editMode;
  }

  getEditUserDetails() {
    return { user: this.selectedUser, index: this.selectedUserIndex };
  }

  getEditState() {
    return this.editMode;
  }

  setEditUserDetails(task: any, index: any) {
    this.selectedUser = { ...task };
    this.selectedUserIndex = index;
    this.editMode = true;
    this.addUserModal = true;
    this.userDetailsUpdated.next();
  }

  private resetEditState() {
    this.selectedUser = null;
    this.selectedUserIndex = null;
    this.editMode = false;
  }

  // Routes

  // Getting all users
  getUsersFromDb(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllUsers`);
  }

  // Creating a new user
  addNewUser(userDetails: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(`${this.apiUrl}/addNewUser`, userDetails, {
      headers,
    });
  }

  // Deleting a user by id
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteUser/${id}`);
  }

  // Update USer Details

  updateUserDetails(userDetails: any, id: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/updateUserDetails/${id}`,
      userDetails
    );
  }
}
