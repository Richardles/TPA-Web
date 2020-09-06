import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  lastKey;
  videos = [];
  filteredVids = [];
  observer: any;
  user;
  todayV = []
  weekV = []
  monthV = []
  isNotLogged;
  loggedUser;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.isNotLogged = true
    this.loggedUser = this.getLoggedUser()
    if(this.loggedUser != null){
      this.lastKey = 6;
      this.observer = new IntersectionObserver((entry)=>{
        if(entry[0].isIntersecting){
          let container = document.querySelector(".container");
          for(let i: number = 0; i< 4; i++){
            if(this.lastKey < this.videos.length){
              console.log(this.lastKey);
              let div = document.createElement("div");
              let v = document.createElement("app-video-box");
              div.setAttribute("class", "video-container");
              v.setAttribute("video", "this.videos[this.lastKey]");
              div.appendChild(v);
              container.appendChild(div);
              this.lastKey++;
            }
          }
        }
      
      });
      this.observer.observe(document.querySelector(".footer-scroll"));
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
      this.filter()
      let v = this.videos
      console.log(v);
      // for(let i = 0; i< 5; i++){
      //   for (let index = 0; index < v.length; index++) {
      //     const element = v[index];
      //     this.videos.push(element)
      //   }
      // }
      console.log(this.videos)
    },(error) => {
      console.log(error);
    })
  }

  filter(){
    for(let i = 0; i < this.videos.length; i++){
      if(this.user.subscribed.includes(this.videos[i].userId)){
        if(this.videos[i].visibility == "Public"){
          this.filteredVids.push(this.videos[i])
        }
      }
    }
    this.filterDate()
  }

  getPassingVideo(v){
    console.log(v.id)
  }

  getLoggedUser(){
    let users = JSON.parse(localStorage.getItem("currentUser"))
    if(users != null){
      this.getUser(users)
      this.isNotLogged = false
    }else{
      this.isNotLogged = true
    }
    return users
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
      this.filter()
      console.log(this.videos.length);
    }),(error)=>{
      console.log(error);
    }
  }

  filterDate(){
      for(let i = 0; i < this.filteredVids.length; i++){
        let v = this.transform(this.filteredVids[i].date).toString()
        if(v.includes('hour') || v.includes('minute') || v.includes('second')){
          this.todayV.push(this.filteredVids[i])
        }
      }
      for(let i = 0; i < this.filteredVids.length; i++){
        let v = this.transform(this.filteredVids[i].date).toString()
        if(v.includes('day') || v.includes('hour') || v.includes('minute') || v.includes('second')){
          this.weekV.push(this.filteredVids[i])
        }
      }
      for(let i = 0; i < this.filteredVids.length; i++){
        let v = this.transform(this.filteredVids[i].date).toString()
        if(v.includes('week') || v.includes('day') || v.includes('hour') || v.includes('minute') || v.includes('second')){
          this.monthV.push(this.filteredVids[i])
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

}
