import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trending-videos',
  templateUrl: './trending-videos.component.html',
  styleUrls: ['./trending-videos.component.scss']
})
export class TrendingVideosComponent implements OnInit {

  @Output() passVideo = new EventEmitter<any>()
  @Input() video: any;
  userId;
  modal;
  playlist_modal;

  constructor(private apollo: Apollo, private router:Router) { }

  ngOnInit(): void {
    console.log(this.video)
    if(this.video.userId != null){
      console.log("getUser")
      this.getUserById()
    }
    this.modal = false;
    this.playlist_modal = false;
  }

  getUserById(){
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
        id: this.video.userId
      }
    }).valueChanges.subscribe(result => {
      console.log(result.data.getUser)
      this.userId = result.data.getUser
    },(error) => {
      console.log(error);
    })
  }

  toggleModal(){
    if(this.modal){
      this.modal = false
    }else{
      this.modal = true
    }
  }

  
  toChannel(){
    this.router.navigateByUrl("/channel-app/" + this.userId.id + "/home");
  }

  routerToPlaylistModal(){
    if(this.playlist_modal){
      this.playlist_modal = false
      this.modal = false
    }else{
      this.playlist_modal = true
      this.modal = false
    }
  }

  showPlaylistModal(){
    this.passVideo.emit(this.video);
  }

}
