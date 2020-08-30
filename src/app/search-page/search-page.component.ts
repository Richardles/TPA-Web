import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  isFiltering
  channels
  videos
  playlists

  typeVideo
  typeChannel
  typePlaylist
  currentType

  query
  constructor(private apollo:Apollo, private route:ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      
      this.query = params.get('query');
      if(this.query !== null) {
        console.log(this.query);
      }
    })
    this.typeVideo = true
    this.typeChannel = true
    this.typePlaylist = true
    this.isFiltering = false
    // this.GetAllUsers()
    // this.GetAllVideos()
    // this.GetAllPlaylists()
    this.GetUsersWhereNameLike()
    this.GetVideosWhereNameLike()
    this.GetPlaylistsWhereNameLike()

  }

  GetUsersWhereNameLike(){
    this.apollo.query<any>({
      query:gql`
      query GetUsersWhereNameLike($query: String!){
        getUsersByName(name: $query){
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
        query: this.query
      }
    }).subscribe( res=>{
      this.channels = res.data.getUsersByName
    }),(error)=>{
      console.log(error);
      console.log("asd");
      
    }
  }

  GetVideosWhereNameLike(){
    this.apollo.watchQuery<any>({
      query:gql`
      query GetVideosWhereNameLike($query: String!){
        getVideosByName(name: $query){
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
        query: this.query
      }
    }).valueChanges.subscribe( res=>{
      this.videos = res.data.getVideosByName
    }),(error)=>{
      console.log(error);
    }
  }

  GetPlaylistsWhereNameLike(){
    this.apollo.watchQuery<any>({
      query:gql`
      query GetPlaylistsWhereNameLike($query: String!){
        getPlaylistsByName(name: $query){
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
        query: this.query
      }
    }).valueChanges.subscribe( res=>{
      this.playlists = res.data.getPlaylistsByName
    }),(error)=>{
      console.log(error);
    }
  }

  changeType(type){
    if(type == this.currentType){
      this.typeChannel = true
      this.typeVideo = true
      this.typePlaylist = true
    }else{
      if(type == "channel"){
        this.currentType = "channel"
        this.typeChannel = true
        this.typeVideo = false
        this.typePlaylist = false
      }else if(type == "video"){
        this.currentType = "video"
        this.typeChannel = false
        this.typeVideo = true
        this.typePlaylist = false
      }else{
        this.currentType = "playlist"
        this.typeChannel = false
        this.typeVideo = false
        this.typePlaylist = true
      }
    }
  }

  GetAllPlaylists(){
    this.apollo.watchQuery<any>({
      query:gql`
      query GetAllPlaylists{
        playlists{
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
      `
    }).valueChanges.subscribe( result =>{
      this.playlists = result.data.playlists
    }),(error)=>{
      console.log(error);
    }
  }

  GetAllVideos(){
    this.apollo.watchQuery<any>({
      query:gql`
      query GetAllVideos{
        videos{
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
      `
    }).valueChanges.subscribe( result =>{
      this.videos = result.data.videos

    }),(error)=>{
      console.log(error);
    }
  }

  GetAllUsers(){
    this.apollo.watchQuery<any>({
      query:gql`
      query getAllUsers{
        users{
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
    }).valueChanges.subscribe( result =>{
      this.channels = result.data.users
    }),(error)=>{
      console.log(error);
    }
  }

  toggleFilter(){
    if(this.isFiltering){
      this.isFiltering = false
    }else{
      this.isFiltering = true
    }
  }

  getPassingVideo(v){
    console.log(v.id)
  }

  

}
