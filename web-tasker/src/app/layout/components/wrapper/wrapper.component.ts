import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AccountService } from 'src/app/services/account-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import {
  sideNavAnimation,
  sideNavContainerAnimation,
} from './wrapper.animations';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
  animations: [sideNavAnimation, sideNavContainerAnimation],
})
export class WrapperComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<any> = new EventEmitter();
  //@ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  /**Variables used by sidenav status */
  isExpanded!: boolean;
  isOpen!: boolean;
  sublist!: boolean;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private sidenavService: SidenavService
  ) {}

  ngOnInit(): void {
    const expanded = this.sidenavService.getIsExpanded();
    const open = this.sidenavService.getIsOpen();
    const sublist = this.sidenavService.getSublist();
    if (expanded === 'true') {
      this.isExpanded = true;
    } else {
      this.isExpanded = false;
    }
    if (open === 'true') {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
    if (sublist === 'true') {
      this.sublist = true;
    } else {
      this.sublist = false;
    }
  }

  toggle() {
    let status;
    this.isOpen = !this.isOpen;

    if(this.isOpen === true){
      status = 'true';
    }else{
      status = 'false';
    }
    //update local storage
    this.sidenavService.setIsOpen(status);
    if (this.isExpanded === true) {
      this.isExpanded = false;
      this.sidenavService.setIsExpanded('false');
    } else {
      this.isExpanded = true;
      this.sidenavService.setIsExpanded('true');
    }
  }

  logout1() {
    this.authService.logout();
    //console.log("logout works!!");
  }

  logout(): void {
    this.authService.logout();

    //window.location.reload();
  }

  showSublist() {
    let status;
    this.sublist = !this.sublist;
    if(this.sublist === true){
      status = 'true';
    }else{
      status = 'false';
    }
    //update local storage
    this.sidenavService.setSublist(status);
  }
}
