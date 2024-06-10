import { Component, OnInit } from '@angular/core';
import { Technicien } from 'src/app/models/technicien.model';
import { LoginService } from 'src/app/services/login.service';
import { Reponse } from 'src/app/models/reponse.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user: Technicien

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.getUserById();
  }


  getUserById(){
    this.loginService.getTechnicienById(localStorage.getItem("userId")).subscribe(
      (reponse: Reponse) =>{
          this.user = reponse.data
          
      },
      err =>{

      }
    )
  }
}
