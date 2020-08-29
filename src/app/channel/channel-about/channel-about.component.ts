import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-channel-about',
  templateUrl: './channel-about.component.html',
  styleUrls: ['./channel-about.component.scss']
})
export class ChannelAboutComponent implements OnInit {

id;
user;
isUpdating;
desc;

  constructor(private route: ActivatedRoute, private apollo: Apollo) { }

  ngOnInit(): void {
    this.id = this.route.parent.snapshot.paramMap.get('id');
    this.getUser()
    this.isUpdating = false;
  }

  getUser(){
    this.apollo.watchQuery<any>({
      query: gql `
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
      this.user = result.data.getUser;
    },(error) => {
      console.log(error);
    })
  }

  toggleDesc(){
    if(this.isUpdating){
      this.isUpdating = false
    }else{
      this.isUpdating = true
    }
    this.desc = "";
  }

  updateDesc(event){
    // this.desc = ((event.target as Element).closest(".descTAsection").querySelector("textarea") as HTMLTextAreaElement).value;
    this.apollo.mutate({
      mutation:gql`
      mutation UpdateChannelDescription ($id : String!, $newDesc: String!){
        updateChannelDescription(user_id: $id, newDesc: $newDesc){
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
      `,variables:{
        id: this.id,
        newDesc: this.desc
      }
    }).subscribe(result => {
      this.toggleDesc()
    },(error) => {
      console.log(error);
    })
  }

}
