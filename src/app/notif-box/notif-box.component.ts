import { Component, OnInit, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-notif-box',
  templateUrl: './notif-box.component.html',
  styleUrls: ['./notif-box.component.scss']
})
export class NotifBoxComponent implements OnInit {

  @Input() notif
  notifToShow;
  user;
  video;
  post;
  Url;

  constructor(private apollo:Apollo) { }

  ngOnInit(): void {
    this.getUser()
    this.setNotif()
  }

  setNotif(){
    
    if(this.notif.video_id != 0){
      this.getVideoById()
      console.log("vid");
      
    }else{
      this.getPost()
      console.log("pos");
      
    }
    console.log(this.notifToShow);
    
  }

  getPost(){
    this.apollo.watchQuery<any>({
      query:gql`
      query GetPost($id: Int!){
        getPost(id: $id){
          id
          picture_url
          likes
          dislikes
          date
          title
          description
          channel_id
        }
      }
      `,variables:{
        id: this.notif.post_id
      }
    }).valueChanges.subscribe( result => {
      this.post = result.data.getPost
      console.log(this.post);
      this.notifToShow = this.post
      this.Url = this.post.picture_url
    }),(error) => {
      console.log(error);
    }
  }

  getVideoById(){
    this.apollo.watchQuery<any>({
      query: gql `
      query GetVideo($id: Int!){
        getVideo(id: $id){
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
      `,
      variables:{
        id: this.notif.video_id
      }
    }).valueChanges.subscribe(result => {
      this.video = result.data.getVideo;
      this.notifToShow = this.video
      this.Url = this.video.thumbnail
      console.log(this.video);
      
    },(error) => {
      console.log(error);
    })
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
        id: this.notif.user_id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
      console.log(this.user);
    },(error) => {
      console.log(error);
    })
  }

}
