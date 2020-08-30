import { Component, OnInit, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-playlist-box',
  templateUrl: './playlist-box.component.html',
  styleUrls: ['./playlist-box.component.scss']
})
export class PlaylistBoxComponent implements OnInit {

  @Input() playlist
  playlistThumbnail;
  vidId;
  video;
  playlistVideos = [];

  constructor(private apollo:Apollo) { }

  ngOnInit(): void {
    
    this.playlistVideos = this.playlist.videos_id.toString().split(',').map(Number);
    this.vidId = this.playlistVideos[0];
    this.getVideoById()
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

}
