import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-channel-home',
  templateUrl: './channel-home.component.html',
  styleUrls: ['./channel-home.component.scss']
})
export class ChannelHomeComponent implements OnInit {

  videos;
  randVideos;
  showRandVids: Array<any> = [];
  id;
  playlists
  showPlaylists = [];
  user

  constructor(private apollo: Apollo, private route: ActivatedRoute, private router: Router) {
    // this.getVideo();
  }

  toChannel(){
    this.router.navigateByUrl("/channel-app/" + this.id + "/videos")
  }

  
  
  ngOnInit(): void {
    this.id = this.route.parent.snapshot.paramMap.get('id');
    this.getLoggedUser()
    this.getLastVideo();
    this.getPlayListByUser();
  }

  getLoggedUser(){
    let users = JSON.parse(localStorage.getItem("currentUser"))
    if(users != null){
      this.getUser(users)
    }else{
      this.getPublicNotPremium()
    }
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
      this.randVideos = res.data.getPublicNonPremiumVideos
      console.log(res.data.getPublicNonPremiumVideos);
      
      this.popVideos()
    }),(error)=>{
      console.log(error);
      
    }
  }

  getUser(users){
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
            like_video
            dislike_video
            like_post
            dislike_post
            premium_type
          }
        }
      `,
      variables:{
        id: users.id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
      if(this.user.premium_type != "monthly" && this.user.premium_type != "annually"){
        this.getNonPremium()
      }else{
        this.getVideo()
      }
    },(error) => {
      console.log(error);
    })
  }

  getNonPremium(){
    this.apollo.query<any>({
      query:gql`
      query GetNotPremium{
        getNotPremiumVideos{
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
      this.randVideos = res.data.getNotPremiumVideos
      this.secFilter()
    }),(error)=>{
      console.log(error);
    }
  }

  secFilter(){
    let arr = []
    for(let i = 0; i < this.randVideos.length; i++){
      if(this.randVideos[i].userId == this.id){
        arr.push(this.randVideos[i])
      }else{
        if(this.randVideos[i].visibility == "Public"){
          arr.push(this.randVideos[i])
        }
      }
    }
    this.randVideos = arr
    
    this.popVideos()
  }

  popVideos(){
    let pushed = []
    let i = 0;
    let ctr = 0;
    while(i < this.randVideos.length){
       let idx = this.randVideos[Math.floor(Math.random() * (this.randVideos.length - 0) + 0)];
       console.log(idx)
       if(idx.userId == this.id){
         if(!pushed.includes(idx.id)){
           this.showRandVids.push(idx)
           pushed.push(idx.id)
           i++
         }
       }
       ctr++
       if(ctr >= this.randVideos.length*2){
         break;
       }
    }

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
        id: this.id
      }
    }).valueChanges.subscribe(({ data }) => {
        this.playlists = data.getPlaylistByUser
        this.popPlay();
    },(error) => {
      console.log('there was an error sending the query', error);
    })
  }

  popPlay(){
    let pushed = []
    let i = 0;
    let ctr = 0;
    while(i < this.playlists.length){
       let idx = this.playlists[Math.floor(Math.random() * (this.playlists.length - 0) + 0)];
       console.log(idx)
       if(idx.userId == this.id){
         if(!pushed.includes(idx.id)){
           this.showPlaylists.push(idx)
           pushed.push(idx.id)
           i++
         }
       }
       ctr++
       if(ctr >= 200){
         break;
       }
    }
  }

  getVideo(){
    this.apollo.watchQuery<any>({
      query: gql`
      query GetAllVideo{
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
          date
          visibility
          premium
        }
      }
      `
    }).valueChanges.subscribe(result => {
      this.randVideos = result.data.videos
      this.secFilter()
    },(error) => {
      console.log("No rand vids -> "+error);
    })
  }

  getLastVideo(){
    this.apollo.watchQuery<any>({
      query:gql`
      query GetLastVideo($id: String!){
        getLastVideo(id: $id){
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
        id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.videos = result.data.getLastVideo
      console.log(result.data.getLastVideo)
    },(error) => {
      console.log(error);
    })
  }

}
