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

  constructor(private apollo: Apollo, private route: ActivatedRoute, private router: Router) {
    // this.getVideo();
  }

  toChannel(){
    this.router.navigateByUrl("/channel-app/" + this.id + "/videos")
  }
  
  ngOnInit(): void {
    this.id = this.route.parent.snapshot.paramMap.get('id');
    this.getLastVideo();
    this.getVideo();
  }

  popVideos(){
    let pushed = []
    let i = 0;
    let ctr = 0;
    while(i < 5){
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
        }
      }
      `
    }).valueChanges.subscribe(result => {
      this.randVideos = result.data.videos
      this.popVideos()
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
