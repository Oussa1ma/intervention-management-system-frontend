import { Component, OnInit } from '@angular/core';
import { Reponse } from 'src/app/models/reponse.model';
import { Technicien } from 'src/app/models/technicien.model';
import { TechnicienService } from 'src/app/services/technicien.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  public editForm: FormGroup;

  public techniciens: Technicien[]
  public msg = ""
  public closeResult: string;


  constructor(
    private formBuilder: FormBuilder,
    private technicienService: TechnicienService,
    private modalService: NgbModal,
    private toastr: ToastrService) {
    this.createEditForm();
    this.allTechniciens()
  }

  createEditForm() {
    this.editForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['',Validators.compose([
        Validators.required, Validators.email,
        Validators.pattern(/^([a-zA-Z0-9\.-]+)@([a-zA-Z\.-]+)\.([a-z]{2,6})$/)
      ])],
      role: new FormControl(),
      tel: new FormControl()
    })
  }


  allTechniciens() {
    this.technicienService.allTechniciens()
    .subscribe((reponse: Reponse) => {
      this.techniciens = reponse.data.filter(technicien=> technicien.username != "No body")
    },err => {
      this.msg="error when loading users data \n"+err
    })
  }
  
  // Deleting popup
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  deleteTechnicien(id: any) {
    this.technicienService.delete(id)
    .subscribe( (reponse: Reponse) => {
      if(reponse.success){
        this.toastr.info(reponse.message, 'Technicien', 
        {
          timeOut: 2500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
          this.allTechniciens();
      }
    },err => {
      this.msg = (`error message: ${err.message}`);
    })
  }

  patchValues(id: string) {
    const technicien = this.techniciens.find(technicien => technicien._id == id)
    this.editForm.patchValue({
      username: technicien.username,
      email: technicien.email,
      role: technicien.role,
      tel: technicien.tel
    })
  }
  updateTechnicien(id) {
    const data = {
      body: this.editForm.value,
      params: {id: id}
    }
    this.technicienService.update(data)
    .subscribe((reponse: Reponse) => {
      if(reponse.success) {
        this.toastr.info(reponse.message, 'Technicien', 
        {
          timeOut: 2500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
        this.allTechniciens();
      }
    },err => {
      this.msg = (`error message: ${err.message}`);
    });
  }


  ngOnInit() {
  }

}