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
      // console.log(v);
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

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.getVideo()

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

  getPassingVideo(v){
    console.log(v.id)
  }

}
