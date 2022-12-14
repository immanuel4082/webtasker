import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ad-teams',
  templateUrl: './ad-teams.component.html',
  styleUrls: ['./ad-teams.component.scss'],
})
export class AdTeamsComponent implements OnInit {
  teams!: any[];
  teamDiv: any;
  teamStatus: any;
  submitted: boolean = false;
  /**used by search bar */
  searchText = '';

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTeams();
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      console.log(params);
    });
    this.scrollDown();
  }

  getTeams() {
    this.teamService.getAllTeams().subscribe((teams: any) => {
      console.log(teams);
      this.teams = teams;
      //get team members for each
      this.getTeamMembers();
    });
  }

  /**scrolldown immediately after adding new team */
  scrollDown() {
    //ensuring intervals only run once
    if (this.teamService.getAddStatus() === true) {
      const setInterval_ID = window.setInterval(() => {
        this.teamDiv = document.getElementById('teams');
        this.teamDiv.scrollTop = this.teamDiv?.scrollHeight;
      }, 100);

      //stopping interval above after sometime
      window.setTimeout(() => {
        window.clearInterval(setInterval_ID);
      }, 500);
    }
    //unsetting the condition
    this.teamService.setAddStatus(false);
    //console.log(this.teamService.getAddStatus());
  }

  /**Capture team to help load it to edit component */
  captureTeam(team: string) {
    this.teamService.setCapturedTeam(team);
  }

  /**ACTION METHODS USED BY ALERT*/
  alertConfirmation(teamId: string, teamName: string) {
    Swal.fire({
      title: `Delete "${teamName}"?`,
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete team from db
      if (result.value) {
        this.deleteteam(teamId, teamName);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          `Team "${teamName}" still in our database.)`,
          'error'
        );
      }
    });
  }

  /**Delete method */
  deleteteam(teamId: string, teamName: string) {
    this.teamService.deleteTeam(teamId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.router.navigate(['/ad_teams']);
        Swal.fire('Removed!', `team "${teamName}" has been removed`, 'success');
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  /**Get team members for each */
  getTeamMembers() {
    if (this.teams.length > 0) {
      for (let i = 0; i < this.teams.length; i++) {
        this.teamService
          .getTeamMembersDoc(this.teams[i]._id)
          .subscribe((members: any) => {
            console.log(members.length);
            //push number of members to projects
            this.teams[i].members = members.length;
          });
      }
    }
  }

  submit() {
    this.submitted = true;
  }
}
