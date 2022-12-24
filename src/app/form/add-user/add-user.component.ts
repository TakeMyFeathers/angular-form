import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../user.service";
import {User} from "../../model/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    password: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
      Validators.pattern(/^[0-9]*$/i)
    ]]
  })

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const {name, password, email, phone} = this.form.controls;
    const user: Omit<User, "id"> = {
      name: name.value,
      password: password.value,
      email: email.value,
      phone: phone.value
    }

    this.userService.addUser(user).subscribe(res => {
      this.router.navigate(['/']);
    });
  }
}
