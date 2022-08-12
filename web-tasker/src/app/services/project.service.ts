import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  //variable to help view newly created project
  private projectAdded: Boolean = false;

  constructor(private webReqService: WebRequestService) { }

  createList(title: string){
    //send a web request to create a list
    return this.webReqService.post('lists',{title});
  }

  getLists(){
    //send a web request to get lists
    return this.webReqService.get('lists');
  }

  getProjects(){
    //send a web request to get user projects
    return this.webReqService.get('projects/myprojects');
  }

  getAllProjects(){
    //send a web request to get user projects
    return this.webReqService.get('projects');
  }

  createProject(projectName:string){
    //send a web request to create a project
    return this.webReqService.post('projects',{projectName});
  }

  editProject(newProject: string){
    return this.webReqService.patch('projects',{newProject});
  }

  deleteProject(projId: string){
    return this.webReqService.delete(`projects/${projId}`);
  }

  /**Methods used by projectAdded above */
  getAddStatus(){
    return this.projectAdded;
  }

  setAddStatus(status: Boolean){
    this.projectAdded = status;
  }
}
