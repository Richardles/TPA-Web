import { Component, OnInit, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-playlist-box-search',
  templateUrl: './playlist-box-search.component.html',
  styleUrls: ['./playlist-box-search.component.scss']
})
export class PlaylistBoxSearchComponent implements OnInit {
  
  @Input() playlist
  playlistThumbnail;
  vidId;
  video;
  user;
  playlistVideos = [];

  constructor(private apollo:Apollo) { }

  ngOnInit(): void {
    this.playlistVideos = this.playlist.videos_id.toString().split(',').map(Number);
    this.vidId = this.playlistVideos[0];
    this.getVideoById()
    if(this.playlist != null){
      this.getUser()
    }
  }

  getVideoById(){
    this.apollo.watchQuery<any>({
      query: gql`
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
        id: this.vidId
      }
    }).valueChanges.subscribe(result => {
      this.video = result.data.getVideo;
      this.playlistThumbnail = this.video.thumbnail
    },(error) => {
      console.log(error);
    })
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
            like_comment
            dislike_comment
            subscribed
            notified_by
          }
        }
      `,
      variables:{
        id: this.playlist.userId
      }
    }).valueChanges.subscribe(result => {
      
      this.user = result.data.getUser;
      console.log(this.user);
    },(error) => {
      console.log(error);
    })
  }

}
