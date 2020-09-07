import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {

  category
  videos = [];
  alltime = [];
  week = [];
  month = [];
  recent = [];
  user

  constructor(private route: ActivatedRoute, private apollo: Apollo) {
    this.route.params.subscribe(param => {
      this.category = param['category'];
      console.log(this.category);
    })
  }

  ngOnInit(): void {
    this.getLoggedUser()
    // this.getVideos()
  }

  getPassingVideo(v){
    console.log(v.id)
  }

  getLoggedUser(){
    this.user = JSON.parse(localStorage.getItem("currentUser"))
    if(this.user != null){
      this.getUser()
    }else{
      this.getPublicNotPremium()
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
        this.getVideos()
      }
    },(error) => {
      console.log(error);
    })
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
      let v = res.data.getPublicNonPremiumVideos
      for(let i = 0; i < v.length; i++){
        if(v[i].category == this.category){
          this.videos.push(v[i])
        }
      }
      this.filterVid()
    }),(error)=>{
      console.log(error);
      
    }
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
      let v = res.data.getNotPremiumVideos
      console.log(v);
      for(let i = 0; i < v.length; i++){
        if(v[i].category == this.category){
          this.videos.push(v[i])
        }
      }
      this.secFilter()
      console.log(this.videos.length);
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
    this.filterVid()
  }

  getVideos(){
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
        cate: this.category
      }
    }).valueChanges.subscribe( result => {
      this.videos = result.data.getVideosByCategory
      this.secFilter()
    }),(error) => {
      console.log(error);
    }
  }

  filterVid(){
    for(let i = 0; i < this.videos.length; i++){
      let v = this.transform(this.videos[i].date).toString()
      console.log(v);
      if(v.includes('day') || v.includes('hour') || v.includes('minute') || v.includes('second')){
        this.week.push(this.videos[i])
      }
    }
    for(let i = 0; i < this.videos.length; i++){
      let v = this.transform(this.videos[i].date).toString()
      console.log(v);
      if(v.includes('week') || v.includes('day') || v.includes('hour') || v.includes('minute') || v.includes('second')){
        this.month.push(this.videos[i])
      }
    }
    for(let i = 0; i < this.videos.length; i++){
      let v = this.transform(this.videos[i].date).toString()
      console.log(v);
      if(v.includes('hour') || v.includes('minute') || v.includes('second')){
        this.recent.push(this.videos[i])
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
