import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channel-videos',
  templateUrl: './channel-videos.component.html',
  styleUrls: ['./channel-videos.component.scss']
})
export class ChannelVideosComponent implements OnInit {

videos = [];
lastKey:number = 12;
observer: any
filteredVids = [];
id;
user;
temp = []
isSort

  constructor(private apollo: Apollo, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isSort = false
    this.id = this.route.parent.snapshot.paramMap.get('id');
    // this.getVideo()
    // this.getVideosOfUserId()
    this.getLoggedUser()

    this.lastKey = 12;
    this.observer = new IntersectionObserver((entry)=>{
      if(entry[0].isIntersecting){
        let container = document.querySelector(".container");
        for(let i: number = 0; i< 10; i++){
          if(this.lastKey < this.filteredVids.length){
            console.log(this.lastKey);
            let div = document.createElement("div");
            let v = document.createElement("app-video-box");
            div.setAttribute("class", "video-container");
            v.setAttribute("video", "this.filteredVids[this.lastKey]");
            div.appendChild(v);
            container.appendChild(div);
            this.lastKey++;
          }
        }
      }
    
    });
    this.observer.observe(document.querySelector(".footer-scroll"));
  }

  getLoggedUser(){
    let users = JSON.parse(localStorage.getItem("currentUser"))
    if(users != null){
      if(users.id == this.id){
        this.getVideosOfUserId()
      }else{
        this.getUser(users)
      }
    }else{
      this.getNonPremium()
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
      this.videos = res.data.getNotPremiumVideos
      console.log(this.videos.length);
      this.secFilter()
    }),(error)=>{
      console.log(error);
    }
  }

  secFilter(){
    let arr = []
    for(let i = 0; i < this.videos.length; i++){
      if(this.videos[i].userId == this.id){
        arr.push(this.videos[i])
      }else{
        if(this.videos[i].visibility == "Public"){
          arr.push(this.videos[i])
        }
      }
    }
    this.videos = arr
    
    this.filterVideos()
  }

  filterVideos(){
    let pushed = []
    let i = 0
    let ctr = 0;
    while(i < this.videos.length){
       let idx = this.videos[Math.floor(Math.random() * (this.videos.length - 0) + 0)];
       console.log(idx)
       if(idx.userId == this.id){
         if(!pushed.includes(idx.id)){
           this.filteredVids.push(idx)
           pushed.push(idx.id)
           i++
         }
       }1
       ctr++
       if(ctr >= 200){
         break
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
          playlist_id
          category
          audience
          visibility
          premium
          date
        }
      }
      `,
    }).valueChanges.subscribe(result => {
      this.videos = result.data.videos
      this.secFilter()
      console.log(this.videos)
    },(error) => {
      console.log(error);
    })
  }

  getVideosOfUserId(){
    this.apollo.watchQuery<any>({
      query: gql`
      query GetVideosByUserId($id: String!){
        getVideosByUserId(user_id: $id){
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
      this.videos = result.data.getVideosByUserId
      for(let i = 0; i < this.videos.length; i++){
        this.filteredVids.push(this.videos[i])
      }
    },(error) => {
      console.log(error);
    })
  }

  toggleSort(){
    if(this.isSort){
      this.isSort = false
    }else{
      this.isSort = true
    }
  }

  mostPopular(){
    console.log(this.filteredVids);
    
    this.toggleSort()
    for(let i = 0; i < this.filteredVids.length; i++){
      for(let j = 0; j < this.filteredVids.length-i-1; j++){
        if(this.filteredVids[j].views < this.filteredVids[j+1].views){
          let t = this.filteredVids[j]
          this.filteredVids[j] = this.filteredVids[j+1]
          this.filteredVids[j+1] = t
        }
      }
    }
  }
  oldest(){
    console.log(this.filteredVids);
    this.toggleSort()
    for(let i = 0; i < this.filteredVids.length; i++){
      for(let j = 0; j < this.filteredVids.length-i-1; j++){
        if(this.filteredVids[j].date.toString() > this.filteredVids[j+1].date.toString()){
          let t = this.filteredVids[j]
          this.filteredVids[j] = this.filteredVids[j+1]
          this.filteredVids[j+1] = t
        }
      }
    }
  }
  newest(){
    console.log(this.filteredVids);
    this.toggleSort()
    for(let i = 0; i < this.filteredVids.length; i++){
      for(let j = 0; j < this.filteredVids.length-i-1; j++){
        let t = this.filteredVids[j]
          if(this.filteredVids[j].date.toString() < this.filteredVids[j+1].date.toString()){
          this.filteredVids[j] = this.filteredVids[j+1]
          this.filteredVids[j+1] = t
        }
      }
    }
  }

}
