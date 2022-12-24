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

  isEditable: Map<string, boolean> = new Map()

  constructor(private fb: FormBuilder, private userService: UserService) {
  }

  get users() {
    return this.form.controls['users'] as FormArray;
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(res => {
      this.data = res as User[];

      for (const row of this.data) {
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

        this.isEditable.set(row.id.toString(), false)
      }
    })
  }

  toggleEdit(userId: number) {
    const id = userId.toString();
    const currentState = this.isEditable.get(id) || false;
    this.isEditable.set(id, !currentState);
  }

  deleteUser(userId: number) {
    const index = this.data.findIndex((user) => user.id === userId)
    if (userId === -1) {
      return;
    }

    this.userService.deleteUser(userId).subscribe(res => {
      console.log("success")
    });

    this.users.removeAt(index);
    this.data = this.data.filter(user => user.id !== userId);
  }

  updateUser(userId: number) {
    const formData = this.form.controls.users.value[0] as Omit<User, "id" | "password">;

    const currUserIndex = this.data.findIndex(user => user.id === userId);
    if (currUserIndex === -1) {
      return;
    }

    const currUser = this.data[currUserIndex];

    const newUser = {
      id: userId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: currUser.password
    }

    this.data[currUserIndex] = newUser;
    this.userService.updateUser(newUser).subscribe(res => {
    });
    this.toggleEdit(userId);
  }
}
