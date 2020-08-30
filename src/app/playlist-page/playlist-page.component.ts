import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { title } from 'process';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent implements OnInit {

  id;
  playlist;
  playlistVideos;
  video;
  videosObj = [];
  playlistThumbnail;
  vidId;
  userPlaylist;
  totalVids;
  editing;

  isUpdatingTitle;
  selectedVis;
  newTitle;
  newCategory;
  newDesc;
  isMore;

  constructor(private route:ActivatedRoute, private apollo: Apollo, private router: Router) { 
    this.route.params.subscribe(param => {
      this.id = param['id'];
      console.log(this.id);
    })}

  ngOnInit(): void {
    this.GetPlaylistById()
    this.editing = false
    this.isUpdatingTitle = false
    this.isMore = false;
  }

  toChannel(){
    this.router.navigateByUrl("/channel-app/" + this.userPlaylist.id + "/home");
  }

  toggleMore(){
    if(this.isMore){
      this.isMore = false
    }else{
      this.isMore = true
    }
  }

  removeAll(){
    this.toggleMore()
    this.EmptyPlaylist()
  }

  EmptyPlaylist(){
    this.apollo.mutate({
      mutation:gql`
      mutation EmptyPlaylist($id: Int!){
        emptyPlaylist(playlist_id: $id){
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
        id: this.id
      }
    }).subscribe( res => {

    }),(error) => {
      console.log(error);
    }
  }

  selectVis(){
    if(this.playlist.view_type == "Public"){
      this.selectedVis = 0
    }else if(this.playlist.view_type == "Private"){
      this.selectedVis = 2
    }else{
      this.selectedVis = 1
    }
    console.log(this.playlist.view_type);
  }

  toggleEditTitle(){
    if(this.isUpdatingTitle){
      this.isUpdatingTitle = false
    }else{
      this.isUpdatingTitle = true
    }
  }

  toggleEditDesc(){
    if(this.editing){
      this.editing = false
    }else{
      this.editing = true
    }
  }

  updateTitle(){
    this.UpdateTitle()
    this.toggleEditTitle()
  }

  removeVideo(event){
    console.log(event);

    this.apollo.mutate({
      mutation:gql`
      mutation UpdatePlaylistVideo($id: Int!, $vid: Int!){
        updateVideoInPlaylist(playlist_id: $id, video_id: $vid){
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
        id: this.id,
        vid: event
      }
    }).subscribe(result => {

    }),(error) => {
      console.log(error);
    }
  }

  GetPlaylistById(){
    this.apollo.watchQuery<any>({
      query: gql`
      query GetPlaylistById($id: Int!){
        getPlaylist(id: $id){
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
        id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.playlist = result.data.getPlaylist
      this.GetThumbnail();
      this.selectVis();
    }),(error) => {
      console.log(error);
    }
  }

  GetThumbnail(){
    this.playlistVideos = this.playlist.videos_id.toString().split(',').map(Number);
    this.vidId = this.playlistVideos[0];
    this.totalVids = this.playlistVideos.length;
    this.getVideoById()
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
        id: this.vidId
      }
    }).valueChanges.subscribe(result => {
      this.video = result.data.getVideo;
      this.playlistThumbnail = this.video.thumbnail
      this.getUser();
      this.pushVideos();
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
          }
        }
      `,
      variables:{
        id: this.playlist.userId
      }
    }).valueChanges.subscribe(result => {
      this.userPlaylist = result.data.getUser
    },(error) => {
      console.log(error);
    })
  }

  pushVideos(){
    for(let i = 0; i < this.playlistVideos.length; i++){
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
          id: this.playlistVideos[i]
        }
      }).valueChanges.subscribe(result => {
        this.videosObj.push(result.data.getVideo);
      },(error) => {
        console.log(error);
      })
    }
  }

  UpdateTitle(){
    this.apollo.mutate({
      mutation:gql`
      mutation UpdatePlaylistTitle($id: Int!, $title: String!){
        updatePlaylistTitle(id: $id,newTitle: $title){
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
        id: this.id,
        title: this.newTitle
      }
    }).subscribe(result => {
      this.videosObj = [];
      this.pushVideos()
    }),(error) => {
      console.log(error);
    }
  }

  UpdatePlayVisibility(){
    this.newCategory = (<HTMLSelectElement>document.getElementById("visibility")).value;
    this.apollo.mutate({
      mutation:gql`
      mutation UpdatePlaylistVisibility($id: Int!, $vis: String!){
        updatePlaylistVisibility(id: $id,newVis: $vis){
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
        id: this.id,
        vis: this.newCategory
      }
    }).subscribe(result => {

    }),(error) => {
      console.log(error);
    }
  }

  UpdatePlayDesc(){
    this.apollo.mutate({
      mutation:gql`
      mutation UpdatePlaylistDescription($id: Int!, $desc: String!){
        updatePlaylistDescription(id: $id, newDesc: $desc){
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
        id: this.id,
        desc: this.newDesc
      }
    }).subscribe(result => {
      this.toggleEditDesc()
    }),(error) => {
      console.log(error);
    }
  }

}
