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
  filteredVid = []
  filteredChan = []
  filteredPlay = []
  nonPremium = []

  typeVideo
  typeChannel
  typePlaylist
  thisWeek
  thisMonth
  thisYear
  currentType
  user;
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
    this.getLoggedUser()
    this.typeVideo = true
    this.typeChannel = true
    this.typePlaylist = true
    this.thisWeek = false
    this.thisMonth = false
    this.thisYear = false
    this.isFiltering = false
    // this.GetAllUsers()
    // this.GetAllVideos()
    // this.GetAllPlaylists()
    this.GetUsersWhereNameLike()
    this.GetVideosWhereNameLike()
    this.GetPlaylistsWhereNameLike()
  }

  getLoggedUser(){
    this.user = JSON.parse(localStorage.getItem("currentUser"))
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
            like_video
            dislike_video
            like_post
            dislike_post
            premium_type
          }
        }
      `,
      variables:{
        id: this.user.id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
      if(this.user.premium_type != "monthly" && this.user.premium_type != "annually"){
        this.filterVid()
      }else{
        this.secFilter()
      }
    },(error) => {
      console.log(error);
    })
  }

  secFilter(){
    let arr = []
    for(let i = 0; i < this.videos.length; i++){
      if(this.videos[i].userId == this.user.id){
        arr.push(this.videos[i])
      }else{
        if(this.videos[i].visibility == "Public"){
          arr.push(this.videos[i])
        }
      }
    }
    this.videos = arr
    console.log(this.videos);
    
  }

  filterVid(){
    for(let i = 0; i < this.videos.length; i++){
      if(this.videos[i].premium == "Not premium"){
        if(this.videos[i].userId == this.user.id){
          this.nonPremium.push(this.videos[i])
        }else{
          if(this.videos[i].visibility == "Public"){
            this.nonPremium.push(this.videos[i])
          }
        }
      }
    }
    this.videos = this.nonPremium
    this.secFilter()
  }

  changeDate(d){
    if(d == 'week'){
      this.filteredVid = []
      this.filteredPlay = []
      this.thisWeek = true
      this.thisMonth = false
      this.thisYear = false
      this.typeVideo = false
      this.typeChannel = false
      this.typePlaylist = false
      console.log(this.transform(this.videos[0].date));
      for(let i = 0; i < this.videos.length; i++){
        let v = this.transform(this.videos[i].date).toString()
        console.log(v);
        if(v.includes('day') || v.includes('hour') || v.includes('minute') || v.includes('second')){
          this.filteredVid.push(this.videos[i])
        }
      }
      for(let i = 0; i < this.playlists.length; i++){
        let p = this.transform(this.playlists[i].last_updated).toString()
        if(p.includes('day') || p.includes('hour') || p.includes('minute') || p.includes('second')){
          this.filteredPlay.push(this.playlists[i])
        }
      }
    }else if(d == 'month'){
      this.filteredVid = []
      this.filteredPlay = []
      this.thisWeek = false
      this.thisMonth = true
      this.thisYear = false
      this.typeVideo = false
      this.typeChannel = false
      this.typePlaylist = false
      var today = new Date();
      console.log(today.toISOString().substring(0, 10));
      console.log(this.videos[0].date);
      let d = today.toISOString().substring(0, 10)
      d = d.substring(0, 7)
      for(let i = 0; i < this.videos.length; i++){
        let v = this.transform(this.videos[i].date).toString()
        console.log(v);
        if(v.includes('week') || v.includes('day') || v.includes('hour') || v.includes('minute') || v.includes('second')){
          this.filteredVid.push(this.videos[i])
        }
      }
      for(let i = 0; i < this.playlists.length; i++){
        let p = this.transform(this.playlists[i].last_updated).toString()
        if(p.includes('week') || p.includes('day') || p.includes('hour') || p.includes('minute') || p.includes('second')){
          this.filteredPlay.push(this.playlists[i])
        }
      }
    }else if(d == 'year'){
      this.filteredVid = []
      this.filteredPlay = []
      this.thisWeek = false
      this.thisMonth = false
      this.thisYear = true
      this.typeVideo = false
      this.typeChannel = false
      this.typePlaylist = false
      for(let i = 0; i < this.videos.length; i++){
        let v = this.transform(this.videos[i].date).toString()
        console.log(v);
        if(v.includes('month') || v.includes('week') || v.includes('day') || v.includes('hour') || v.includes('minute') || v.includes('second')){
          this.filteredVid.push(this.videos[i])
        }
      }
      for(let i = 0; i < this.playlists.length; i++){
        let p = this.transform(this.playlists[i].last_updated).toString()
        if(p.includes('month') || p.includes('week') || p.includes('day') || p.includes('hour') || p.includes('minute') || p.includes('second')){
          this.filteredPlay.push(this.playlists[i])
        }
      }
    }
    
  }

  transform(value: any): any {
    if(value){
      const seconds = Math.floor(((+new Date() - +new Date(value))/1000))
      if(seconds < 29) return 1

      const intervals = {
        'year': 31536000,
        'month': 2592000,
        'week':604800,
        'day':86400,
        'hour':3600,
        'minute':60,
        'second':1
      }

      let counter
      for(const i in intervals){
        counter = Math.floor(seconds / intervals[i])
        if(counter > 0){
          if(counter === 1){
            return counter + ' ' + i
          }else{
            return counter + ' ' + i
          }
        }
      }
    }
    return value
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
          notified_by
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
          date
        }
      }
      `,variables:{
        query: this.query
      }
    }).valueChanges.subscribe( res=>{
      this.videos = res.data.getVideosByName
      if(this.user != null){
        this.getUser()
      }else{
        this.loneFilter()
      }
    }),(error)=>{
      console.log(error);
    }
  }

  loneFilter(){
    let arr = []
    for(let i = 0; i < this.videos.length; i++){
      if(this.videos[i].premium == "Not premium" && this.videos[i].visibility == "Public"){
        arr.push(this.videos[i])
      }
    }
    this.videos = arr
  }

  getPublicNotPremium(){
    this.apollo.query<any>({
      query:gql`
      query GetPublicNonPremiumVideos{
        getPublicNonPremiumVideos{
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
          date
        }
      }
      `
    }).subscribe(res=>{
      this.videos = res.data.getPublicNonPremiumVideos
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
      this.thisWeek = false
      this.thisMonth = false
      this.thisYear = false
    }else{
      if(type == "channel"){
        this.currentType = "channel"
        this.typeChannel = true
        this.typeVideo = false
        this.typePlaylist = false
        this.thisWeek = false
        this.thisMonth = false
        this.thisYear = false
      }else if(type == "video"){
        this.currentType = "video"
        this.typeChannel = false
        this.typeVideo = true
        this.typePlaylist = false
        this.thisWeek = false
        this.thisMonth = false
        this.thisYear = false
      }else{
        this.currentType = "playlist"
        this.typeChannel = false
        this.typeVideo = false
        this.typePlaylist = true
        this.thisWeek = false
        this.thisMonth = false
        this.thisYear = false
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
