import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-related-video',
  templateUrl: './related-video.component.html',
  styleUrls: ['./related-video.component.scss']
})
export class RelatedVideoComponent implements OnInit {

  @Input() video;
  userId;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    console.log(this.video.userId)
    if(this.video.userId != null){
      console.log("getUser")
      this.getUserById()
    }
  }

  getUserById(){
    this.apollo.watchQuery<any>({
      query: gql `
        query GetUser($id: String!){
          getUser(id: $id){
            id
            name
            profile_picture
            subscriber
          }
        }
      `,
      variables:{
        id: this.video.userId
      }
    }).valueChanges.subscribe(result => {
      console.log(result.data.getUser)
      this.userId = result.data.getUser
    },(error) => {
      console.log(error);
    })
  }

}
