import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

id;
loggedUser;
isUserGet;

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    this.route.params.subscribe(param => {
      this.id = param['id'];
      console.log(this.id);
    })
  }

  ngOnInit(): void {
    this.isUserGet = false
    if(!this.isUserGet){
      this.getUser()
    }
  }

  getLoggedUser(){
    let user = JSON.parse(localStorage.getItem("currentUser"))
    return user
  }

  getUser(){
    this.apollo.watchQuery<any>({
      query: gql`
        query GetUser($id: String!){
          getUser(id: $id){
            id
            name
            profile_picture
            subscriber
            email
            location
            premium
            restriction
            premium_date
            channel_icon
            channel_description
            channel_join_date
            channel_views
            channel_location
            channel_art
          }
        }
      `,
      variables:{
        id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.loggedUser = result.data.getUser
      console.log(this.loggedUser);
    },(error) => {
      console.log(error);
    })
  }

}
