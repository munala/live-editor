import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  @Input() onSubmit: Function;
  constructor() {}

  ngOnInit(): void {}
}
