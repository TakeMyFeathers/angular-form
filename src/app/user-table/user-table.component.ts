import {Component, OnInit} from '@angular/core';
import {User} from "../model/user";
import {UserService} from "../user.service";
import {FormArray, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  form = this.fb.group({
    users: this.fb.array([])
  });
  data: User[] = []

  isEditable: boolean[] = []

  constructor(private fb: FormBuilder, private userService: UserService) {
  }

  get users() {
    return this.form.controls['users'] as FormArray;
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(res => {
      this.data = res;
    })
    for (const [i, row] of this.data.entries()) {
      const {name, email, phone} = row;
      this.users.push(
        this.fb.group({
          name: [name, [Validators.required]],
          email: [email, [Validators.required, Validators.email]],
          phone: [phone, [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
            Validators.pattern(/^[0-9]*$/i)
          ]]
        })
      )
      this.isEditable[i] = false;
    }
  }

  toggleEdit(rowIndex: number) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
  }

  deleteUser(rowIndex: number) {
    this.users.removeAt(rowIndex);
    this.userService.deleteUser(this.data[rowIndex].id);
  }

  updateUser(rowIndex: number) {
    const formData = this.form.controls.users.value[0] as Omit<User, "id" | "password">;
    const user = {
      id: this.data[rowIndex].id,
      name: formData.name,
      email: formData.email,
      password: this.data[rowIndex].password,
      phone: formData.phone
    }
    this.data[rowIndex] = user;
    this.userService.updateUser(user);
    this.toggleEdit(rowIndex);
  }
}
