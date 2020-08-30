import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit {

  videos

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.getVideo()
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
        }
      }
      `,variables:{
        cate: category
      }
    }).valueChanges.subscribe( result => {
      this.videos = result.data.getVideosByCategory
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
        }
      }
      `,
    }).valueChanges.subscribe(result => {
      this.videos = result.data.videos
      console.log(this.videos)
    },(error) => {
      console.log(error);
    })
  }



}
