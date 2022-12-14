import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';
import { AccountService } from './account-service.service';
import { StatusService } from './status.service';
import { TokenService } from './token.service';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //variables
  myBool!: boolean;
  readonly positive: string = 'true';
  readonly negative: string = 'false';

  constructor(
    private http: HttpClient,
    private webService: WebRequestService,
    private router: Router,
    private accountService: AccountService,
    private tokenService: TokenService,
    private statusService: StatusService
  ) {}

  /*methods here deal with local storage*/

  login(username: string, password: string) {
    return this.webService.login(username, password).pipe(
      shareReplay(), //avoid multiple execution by multiple subscribers
      tap((res: HttpResponse<any>) => {
        //the auth tokens will be in the header of this response
        this.setSession(
          res.body.user._id,
          res.headers.get('x-token')
          //res.body.authTokens //aka refreshtoken
        );
        //set sidenav statuses
        this.setSidenavValues();
        //set home action button status defaults
        //this.setButtonStatus();

        console.log(`${res.body.user.username} Logged in!`);
        this.router.navigate(['/home']);
      })
    );
  }

  logout() {
    const username = this.accountService.getUser().username;
    this.removeSession();
    this.accountService.clean();
    this.router.navigate(['/login']);
    if (username) {
      console.log(`${username} Logged out!`);
    }
    return this.webService.get('logout').subscribe({
      next: (res) => {
        //console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //deals with local storage
  private setSession(userId: string, accessToken: any) {
    //clear any previous data if any
    this.removeSession();
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
  }

  /**Sets sidenav defaults to local storage
   * Helps preserve sidenav status after refresh
   */
  private setSidenavValues() {
    localStorage.setItem('isExpanded', this.positive);
    localStorage.setItem('sublist', this.negative);
  }

  /**Sets session button defaults to local storage
   * Helps control the start and end buttons
   */
  private setButtonStatus() {
    this.statusService.setEnded('false');
    this.statusService.setStarted('false');
    this.statusService.setPaused('false');
  }

  private removeSession() {
    localStorage.clear();
    // localStorage.removeItem('user-id');
    // localStorage.removeItem('access-token');
    // //clear sidenav statuses
    // localStorage.removeItem('isExpanded');
    // localStorage.removeItem('sublist');
  }

  /**method used by auth guard to check if the user is authorized*/
  verifyUser() {
    this.myBool = false;
    const token1 = this.tokenService.getAccessTokenSession();
    const token2 = this.tokenService.getAccessTokenLocal();
    if (token1 === token2 && token1 !== null) {
      this.myBool = true;
    }
    return this.myBool;
  }

  /**method used by admin guard to authorize admins */
  verifyAdmin() {
    return new Promise((resolve, reject) => {
      /**check from db if user is an admin */
      this.webService.get('users/current').subscribe({
        next: (user) => {
          const isProjectManager = user.isProjectManager;
          resolve(isProjectManager);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }
}
