import { Component, OnInit, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-queue-box',
  templateUrl: './queue-box.component.html',
  styleUrls: ['./queue-box.component.scss']
})
export class QueueBoxComponent implements OnInit {

 @Input() video;
 userId;

  constructor(private apollo:Apollo) { }

  ngOnInit(): void {
    this.getUserById()
  }

  getUserById(){
    this.apollo.watchQuery<any>({
      query: gql`
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
