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

videos;
filteredVids: Array<any> = [];
id;

  constructor(private apollo: Apollo, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.parent.snapshot.paramMap.get('id');
    // this.getVideo()
    this.getVideosOfUserId()
  }

  filterVideos(){
    let pushed = []
    let i = 0
    while(i < this.videos.length){
       let idx = this.videos[Math.floor(Math.random() * (this.videos.length - 0) + 0)];
       console.log(idx)
       if(idx.userId == this.id){
         if(!pushed.includes(idx.id)){
           this.filteredVids.push(idx)
           pushed.push(idx.id)
           i++
         }
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
      `,
    }).valueChanges.subscribe(result => {
      this.videos = result.data.videos
      this.filterVideos()
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
        }
      }
      `,variables:{
        id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.videos = result.data.getVideosByUserId
    },(error) => {
      console.log(error);
    })
  }

}
