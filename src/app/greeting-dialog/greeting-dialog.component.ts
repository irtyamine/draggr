import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../auth/auth.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-greeting-dialog',
  templateUrl: './greeting-dialog.component.html',
  styleUrls: ['./greeting-dialog.component.css']
})
export class GreetingDialogComponent implements OnInit {
	@ViewChild('f') loginForm: NgForm;
	@ViewChild('r') registerForm: NgForm;
	loginEmail = '';
	loginPassword = '';
	registerEmail = '';
	registerPassword = '';
	submitted = false;

  showSignInScreen = false;
  showLogInError = false;
  showSignUpError = false;

  loggedIn: Subscription;

  constructor(private cdref: ChangeDetectorRef,
  	private taskService: TaskService,
  	private authService: AuthService,
  	public dialogRef: MatDialogRef<GreetingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.authService.checkIfLoggedIn();
  	this.taskService.isDialogOpen = true;
  	// this line is to remove ExpressionChangedAfterItHasBeenCheckedError
    // this.cdref.detectChanges();

    this.loggedIn = this.authService.loggedIn
      .subscribe(
        (bool: boolean) => {
          if (bool === true) {this.closeDialog();}
          else {this.showLogInError = true; this.showSignUpError = true;}
        }
      );
  }

  submitLogIn(){

  	this.submitted = true;
  	this.loginEmail = this.loginForm.value.loginData.email;
  	this.loginPassword = this.loginForm.value.loginData.password;

  	this.authService.loginUser(this.loginEmail, this.loginPassword);

  	console.log(this.loginEmail, this.loginPassword);

  	// this.loginForm.reset();
  }

  submitRegister(){
  	this.submitted = true;
  	this.registerEmail = this.registerForm.value.registerData.email;
  	this.registerPassword = this.registerForm.value.registerData.password;

  	this.authService.registerUser(this.registerEmail, this.registerPassword);

  	console.log(this.registerEmail, this.registerPassword);

  	// this.registerForm.reset();
  }

  closeDialog(){
  	this.dialogRef.close();
  }

  switchScreens(){
    this.showSignInScreen = !this.showSignInScreen;
    
  }

  onEnter(code: number){
    this.showLogInError = false;
    this.showSignUpError = false;
    if (code === 0) {this.submitLogIn();}
    else if (code === 1) {this.submitRegister();}
  }

}