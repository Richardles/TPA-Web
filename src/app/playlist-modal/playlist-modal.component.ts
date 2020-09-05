import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';

@Component({
  selector: 'app-playlist-modal',
  templateUrl: './playlist-modal.component.html',
  styleUrls: ['./playlist-modal.component.scss']
})
export class PlaylistModalComponent implements OnInit {
  @Input() isVisible: any;
  @Input() vid: any;
  @Output() closePlaylist = new EventEmitter<boolean>();

  playlists;
  playlistId;
  playlistTitle;
  playlistVisibility;
  formOpen;
  user;

  constructor(private apollo:Apollo) { }

  ngOnInit(): void {
    this.getUserId()
    this.getPlayListByUser()
    this.playlistVisibility = "Public";
  }

  close(){
    this.closePlaylist.emit(false);
    this.formOpen = false; 
  }

  showForm(){
    if(!this.formOpen){
      this.formOpen = true
    }
  }

  getPlayId(id){
    this.playlistId = id;
    console.log(this.playlistId);
    this.updatePlaylist();
  }


  updatePlaylist(){
    console.log(this.vid.id)
    this.apollo.mutate({
      mutation: gql`
      mutation UpdatePlaylistVideo($play_id: Int!, $vid_id: Int!){
        updateVideoInPlaylist(playlist_id: $play_id, video_id: $vid_id){
          id
          title
          total_videos
          views
          last_updated
          view_type
          description
          userId
          videos_id
        }
      }
      `,variables:{
        play_id: this.playlistId,
        vid_id: this.vid.id 
      }
    }).subscribe(res => {
      console.log(res.data)
    })
  }

  getPlayListByUser(){
    this.apollo.watchQuery<any>({
      query: gql`
      query GetPlaylistByUser($id: String!){
        getPlaylistByUser(id: $id){
          id
          title
          total_videos
          views
          last_updated
          view_type
          description
          userId
          videos_id
        }
      }
      `,variables:{
        id: this.user.id
      }
    }).valueChanges.subscribe(({ data }) => {
        this.playlists = data.getPlaylistByUser
        console.log(this.playlists)
    },(error) => {
      console.log('there was an error sending the query', error);
    })
  }

  createPlaylist(){
    this.getInfo()
    this.apollo.mutate({
      mutation: gql`
      mutation CreatePlaylist($title: String!, $view: String!, $desc: String!, $userId: String!){
        createPlaylist(input:{
          title: $title,
          total_videos: 1,
          views: 0,
          view_type: $view,
          description: $desc,
          userId: $userId,
          videos_id: ""
        }){
          id
          title
          total_videos
          views
          last_updated
          view_type
          description
          userId
          videos_id
        }
      }
      `,variables:{
          title: this.playlistTitle,
          view: this.playlistVisibility,
          desc: "",
          userId: this.user.id,
      }
      ,refetchQueries: [{
          query: gql`
          query GetPlaylistByUser($id: String!){
            getPlaylistByUser(id: $id){
              id
              title
              total_videos
              views
              last_updated
              view_type
              description
              userId
              videos_id
            }
          }
          `,variables:{
            id: this.user.id
          }
      }]
    }).subscribe(({ data }) => {

    },(error) => {
      console.log('there was an error sending the query', error);
    })

    this.playlistTitle = "";
  }

  getInfo(){
    this.playlistVisibility = (<HTMLSelectElement>document.getElementById("vis")).value;
    console.log(this.playlistTitle);
  }

  getUserId(){
    this.user = JSON.parse(localStorage.getItem("currentUser"))
  }

}
