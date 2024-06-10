import { Component, OnInit } from '@angular/core';
import { listPagesDB } from 'src/app/shared/tables/list-pages';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {
  public list_pages = [];
  public selected = [];
  public searchTerm: string
  public selectedFilter: string
  constructor() {
    this.list_pages = listPagesDB.list_pages;
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  
  delete(){
    for(let item of this.selected){
      this.list_pages = this.list_pages.filter((ele)=> ele.name != item.name)
      this.selected = []
    }
  }


  searchInputEvent(value:string){
    this.searchTerm = value
  }

  selectedFilterEvent(value: string){
    this.selectedFilter = value
  }

  ngOnInit() {
  }

}
