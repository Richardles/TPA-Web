import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit {

  videos
  filteredVid = []
  user;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    // this.getVideo()
    this.getLoggedUser()
  }

  getLoggedUser(){
    this.user = JSON.parse(localStorage.getItem("currentUser"))
    if(this.user != null){
      this.getUser()
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
      this.videos = res.data.getPublicNonPremiumVideos
      this.pop()
    }),(error)=>{
      console.log(error);
      
    }
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
      if(this.videos[i].userId == this.user.id){
        arr.push(this.videos[i])
      }else{
        if(this.videos[i].visibility == "Public"){
          arr.push(this.videos[i])
        }
      }
    }
    this.videos = arr
    this.pop()
  }



  pop(){
    this.filteredVid = []
    for(let i = 0; i < this.videos.length; i++){
      let v = this.transform(this.videos[i].date).toString()
      console.log(v);
      if(v.includes('day') || v.includes('hour') || v.includes('minute') || v.includes('second')){
        this.filteredVid.push(this.videos[i])
      }
    }
    console.log(this.filteredVid.length);
    
    for(let i = 0; i < this.filteredVid.length; i++){
      for(let j = 0; j < this.filteredVid.length-i-1; j++){
        if(this.filteredVid[j].views < this.filteredVid[j+1].views){
          let t = this.filteredVid[j]
          this.filteredVid[j] = this.filteredVid[j+1]
          this.filteredVid[j+1] = t
        }
      }
    }
    console.log(this.filteredVid.length);
    while(this.filteredVid.length > 20){
      this.filteredVid.pop()
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

  getPassingVideo(v){
    console.log(v.id)
  }

  filter(category){
    this.apollo.watchQuery<any>({
      query:gql`
      query GetVideosByCategory($cate: String!){
        getVideosByCategory(category: $cate){
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
        cate: category
      }
    }).valueChanges.subscribe( result => {
      this.videos = result.data.getVideosByCategory
      this.pop()
    }),(error) => {
      console.log(error);
      
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
    },(error) => {
      console.log(error);
    })
  }



}
