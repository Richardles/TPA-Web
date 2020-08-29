import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.component.html',
  styleUrls: ['./comment-replies.component.scss']
})
export class CommentRepliesComponent implements OnInit {

  loggedUser;

  constructor() { }

  ngOnInit(): void {
    this.loggedUser = this.getLoggedUser()
  }

  getLoggedUser(){
    let user = JSON.parse(localStorage.getItem("currentUser"))
    return user
  }

}
