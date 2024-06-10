import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Reponse } from 'src/app/models/reponse.model';
import { TechnicienService } from 'src/app/services/technicien.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  public accountForm: FormGroup;
  public permissionForm: FormGroup;
  public msg = new FormControl();

  constructor(
    private formBuilder: FormBuilder,
    private technicienService: TechnicienService,
    private navigation :Router,
    private toastr: ToastrService) {

    this.createAccountForm();
  }

  createAccountForm() {
    this.accountForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['',Validators.compose([
        Validators.required, Validators.email,
        Validators.pattern(/^([a-zA-Z0-9\.-]+)@([a-zA-Z\.-]+)\.([a-z]{2,6})$/)
      ])],
      password: ['',Validators.compose([
        Validators.required, Validators.minLength(5), 
        Validators.pattern(/\w{5,14}/)
      ])],
      confirmPwd: ['',Validators.required],
      role: new FormControl(),
      tel: new FormControl()
    })
  }
  

  testSubmit(){
    console.log(this.accountForm.value)
  }


  addTechnicien() {
    this.technicienService.addTechnicien(this.accountForm.value).subscribe((reponse: Reponse) => {
      if(reponse.success){
        this.toastr.info(reponse.message, 'Technicien', 
        {
          timeOut: 2500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
        
        this.navigation.navigate(['users/list-user'])
      }else {
        
      }
    },err => {
      console.log(err);
    })
    
  }


  ngOnInit() {
  }

}