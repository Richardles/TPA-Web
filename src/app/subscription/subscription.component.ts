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
        this.filteredVids.push(this.videos[i])
      }
    }
  }

  getPassingVideo(v){
    console.log(v.id)
  }

  getLoggedUser(){
    let users = JSON.parse(localStorage.getItem("currentUser"))
    this.getUser(users)
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
          }
        }
      `,
      variables:{
        id: users.id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
      this.getVideo()
    },(error) => {
      console.log(error);
    })
  }

}
