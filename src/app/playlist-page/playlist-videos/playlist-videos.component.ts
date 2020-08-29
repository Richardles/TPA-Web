import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-playlist-videos',
  templateUrl: './playlist-videos.component.html',
  styleUrls: ['./playlist-videos.component.scss']
})
export class PlaylistVideosComponent implements OnInit {
  @Input() video;
  @Output() videoId = new EventEmitter<number>();
  userProfile;
  modal;
  playlist_modal;

  constructor(private apollo:Apollo) { }

  ngOnInit(): void {
    this.getUser()
    this.modal = false
  }

  toggleModal(){
    if(this.modal){
      this.modal = false
    }else{
      this.modal = true
    }
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

  removeVideo(){
    this.videoId.emit(this.video.id);
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
        id: this.video.userId
      }
    }).valueChanges.subscribe(result => {
      this.userProfile = result.data.getUser
    },(error) => {
      console.log(error);
    })
  }

}
