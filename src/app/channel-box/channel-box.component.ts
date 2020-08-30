import { Component, OnInit, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-channel-box',
  templateUrl: './channel-box.component.html',
  styleUrls: ['./channel-box.component.scss']
})
export class ChannelBoxComponent implements OnInit {
  GET_USER = gql`
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
      like_comment
      dislike_comment
      subscribed
    }
  }
  `


  @Input() channel: any;
  loggedUser;
  user;
  subsLabel;
  isSub;

  constructor(private apollo:Apollo) { }

  ngOnInit(): void {
    this.isSub = false
    this.subsLabel = "SUBSCRIBE"
    console.log(this.channel);
    this.loggedUser = this.getLoggedUser()
    this.getUser()
  }

  checkSub(){
    let sub = this.user.subscribed
    let check = this.channel.id
    if(sub.includes(check)){
      this.subsLabel = "SUBSCRIBED"
      this.isSub = true
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
            like_comment
            dislike_comment
            subscribed
          }
        }
      `,
      variables:{
        id: this.loggedUser.id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
      this.checkSub()
    },(error) => {
      console.log(error);
    })
  }

  subscribe(){
    this.apollo.mutate({
      mutation:gql`
      mutation UpdateSubscriber($uid: String!, $tid: String!){
        updateSubscriber(user_id: $uid, target_id: $tid){
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
          like_comment
          dislike_comment
          subscribed
        }
      }
      `,variables:{
        uid: this.loggedUser.id,
        tid: this.channel.id
      },refetchQueries:[{
        query: this.GET_USER
        ,variables:{
          id: this.channel.id
        }
      }]
    }).subscribe( result => {
      
    }),(error) => {
      console.log(error);
    }
  }

}
