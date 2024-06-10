import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

  @Output() searchInputEvent = new EventEmitter<string>();
  @Output() selectedFilterEvent = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput: ElementRef<HTMLElement>
  @ViewChild('select') select: ElementRef<HTMLElement>

  foucs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)


  isAdmin: boolean

  constructor() { 
    this.isAdmin = JSON.parse(localStorage.getItem('role'))
   }

  ngAfterViewInit(): void {
    let input = this.searchInput.nativeElement
    let select =  this.select.nativeElement

    input.focus()

    select.addEventListener('focus', (event)=> {
      if(event)
        input.focus()
    })
  }

  ngOnInit(): void {
    this.selectedFilterEvent.emit('task')
  }

  emitSearchInputValue(event){
    this.searchInputEvent.emit(event)
  }

  emitSelectedFilter(event){

    this.selectedFilterEvent.emit(event.target.value)
  }
}
