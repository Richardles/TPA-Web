import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  videos = [];
  lastKey: number = 12;
  observer: any;
  user;

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
      
      this.shuffle(this.videos)
      console.log(this.videos.length)
    },(error) => {
      console.log(error);
    })
  }
  constructor(private apollo: Apollo) { }

  ngOnInit(): void {

    this.getLoggedUser()

    this.lastKey = 12;
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
      this.shuffle(this.videos)
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
      this.shuffle(this.videos)
    }),(error)=>{
      console.log(error);
    }
  }


randVideos = []
shuffle(array) {
      console.log(this.videos.length);
      
      let pushed = []
      let i = 0
      do{
          let idx = this.videos[Math.floor(Math.random() * (this.videos.length - 0) + 0)];
          console.log(idx)
          if(!pushed.includes(idx.id)){
            this.randVideos.push(idx)
            pushed.push(idx.id)
            i++
          }
      }while(i < this.videos.length)
      console.log(this.randVideos.length); 
  }

  getPassingVideo(v){
    console.log(v.id)
  }

}
