import { Injectable, HostListener, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { WINDOW } from "./windows.service";
// Menu
export interface Menu {
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	public screenWidth: any
	public collapseSidebar: boolean = false

	constructor(@Inject(WINDOW) private window) {
		this.onResize();
		if (this.screenWidth < 991) {
			this.collapseSidebar = true
		}
	}

	// Windows width
	@HostListener("window:resize", ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			path: '/dashboard/default', title: 'Dashboard', icon: 'home', type: 'link', badgeType: 'primary', active: false
		},

		{
			title: 'Tâches', icon: 'edit', type: 'sub', active: false, children: [
				{ path: '/tasks/create-task', title: 'Créer', type: 'link' },
				{ path: '/tasks/tasks-list', title: 'Consulter', type: 'link' },
			]
		},

		{
			title: 'Techniciens', icon: 'users', type: 'sub', active: false, children: [
				{ path: '/users/create-user', title: 'Ajouter', type: 'link' },
				{ path: '/users/list-user', title: 'Consulter', type: 'link' },
			]
		},
		// {
		// 	title: 'Pages', icon: 'plus', type: 'sub', active: false, children: [
		// 		{ path: '/pages/create-page', title: 'Ajouter', type: 'link' },
		// 		{ path: '/pages/list-page', title: 'Consulter', type: 'link' },
		// 	]
		// },
		{
			title: 'Rapports', path: '/reports', icon: 'bar-chart', type: 'link', active: false
		},
		{
			title: 'Mes tâches', path: '/my-tasks', icon: 'edit', type: 'link', active: false
		},
		{
			title: 'Logout', path: '/login', icon: 'log-out', type: 'link', active: false
		}
	]
	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);


}
