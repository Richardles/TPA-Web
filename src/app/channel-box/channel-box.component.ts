import { Component, OnInit, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';

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
  videos;
  videoCount;
  isOn

  constructor(private apollo:Apollo, private router:Router) { }

  ngOnInit(): void {
    this.isOn = false
    this.isSub = false
    this.subsLabel = "SUBSCRIBE"
    console.log(this.channel);
    this.loggedUser = this.getLoggedUser()
    if(this.loggedUser != null){
      this.getUser()
    }
  }

  toggleNotif(){
    if(this.isOn){
      this.isOn = false
    }else{
      this.isOn = true
    }
    this.updateNotif()
  }

  updateNotif(){
    this.apollo.mutate({
      mutation:gql`
      mutation UpdateUserNotify($uid: String!, $nid: String!){
        updateUserNotify(user_id: $uid,notif_id: $nid){
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
          notified_by
        }
      }
      `,variables:{
        uid: this.loggedUser.id,
        nid: this.channel.id
      }
    }).subscribe( result => {

    }),(error)=>{
      console.log(error);
    }
  }

  checkNotif(){
    console.log(this.user.notified_by);
    console.log(this.channel.id);
    if(this.user.notified_by.includes(this.channel.id)){
      this.isOn = true
    }else{
      this.isOn = false
    }
  }

  checkSub(){
    let sub = this.user.subscribed
    let check = this.channel.id
    if(sub.includes(check)){
      this.subsLabel = "SUBSCRIBED"
      this.isSub = true
    }else{
      this.subsLabel = "SUBSCRIBE"
      this.isSub = false
    }
  }

  getLoggedUser(){
    let user = JSON.parse(localStorage.getItem("currentUser"))
    if(user != null){
      return user
    }
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
            notified_by
          }
        }
      `,
      variables:{
        id: this.loggedUser.id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
      this.checkSub()
      this.getVideosOfUserId()
      this.checkNotif()
    },(error) => {
      console.log(error);
    })
  }

  subscribe(){
    if(this.loggedUser != null){
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

  toChannel(){
    this.router.navigateByUrl("/channel-app/" + this.channel.id + "/home");
  }

  getVideosOfUserId(){
    this.apollo.watchQuery<any>({
      query: gql`
      query GetVideosByUserId($id: String!){
        getVideosByUserId(user_id: $id){
          id
          url
          title
          likes
          dislikes
          description
          thumbnail
          userId
          views
          playlist_id
          category
          audience
          visibility
          premium
        }
      }
      `,variables:{
        id: this.channel.id
      }
    }).valueChanges.subscribe(result => {
      this.videos = result.data.getVideosByUserId
      this.videoCount = this.videos.length
    },(error) => {
      console.log(error);
    })
  }

}
