import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Reponse } from 'src/app/models/reponse.model';
import { Technicien } from 'src/app/models/technicien.model';
import { LoginService } from 'src/app/services/login.service';
import { Menu, NavService } from '../../service/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit{
  public user: Technicien
  public menuItems: Menu[] = []
  public url: any;
  public fileurl: any;

  userId: string 
  isAdmin: boolean

  
  constructor(
    private router: Router,
    public navServices: NavService,
    private loginService:LoginService) {

      this.userId = localStorage.getItem('userId')
      this.isAdmin = JSON.parse(localStorage.getItem('role'))

    this.navServices.items.subscribe(menuItems => {
      if(this.isAdmin){
        for(let item of menuItems){
          if(item.title != 'Mes tâches')
            this.menuItems.push(item)
        }
      }
      else{
        for(let item of menuItems){
          if(item.title != 'Tâches' && item.title != 'Techniciens')
            this.menuItems.push(item)
        }
      }
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          menuItems.filter(items => {
            if (items.path === event.url)
              this.setNavActive(items)
            if (!items.children) return false
            items.children.filter(subItems => {
              if (subItems.path === event.url)
                this.setNavActive(subItems)
              if (!subItems.children) return false
              subItems.children.filter(subSubItems => {
                if (subSubItems.path === event.url)
                  this.setNavActive(subSubItems)
              })
            })
          })
        }
      })
    })
  }
  ngOnInit(): void {
    this.getUserById()
  }


  // Active Nave state
  setNavActive(item) {
    this.menuItems.filter(menuItem => {
      if (menuItem != item)
        menuItem.active = false
      if (menuItem.children && menuItem.children.includes(item))
        menuItem.active = true
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true
            submenuItems.active = true
          }
        })
      }
    })
  }


  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.menuItems.forEach(a => {
        if (this.menuItems.includes(item))
          a.active = false
        if (!a.children) return false
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false
          }
        })
      });
    }
    item.active = !item.active
  }


  //Fileupload
  readUrl(event: any) {
    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }


  getUserById(){
    this.loginService
      .getTechnicienById(this.userId)
      .subscribe((reponse: Reponse) =>{
          this.user = reponse.data
        },
        err =>{
      })
  }
}