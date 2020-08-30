import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

id;
loggedUser;
isUserGet;

task: AngularFireUploadTask;
percentage: Observable<number>;
snapshot: Observable<any>;
downloadURL: string;
url: string;
showPic;

  constructor(private route: ActivatedRoute, private apollo: Apollo, private storage: AngularFireStorage, private db: AngularFirestore) {
    this.route.params.subscribe(param => {
      this.id = param['id'];
      console.log(this.id);
    })
  }

  ngOnInit(): void {
    this.isUserGet = false
    if(!this.isUserGet){
      this.getUser()
    }
  }

  setUrl($event){
    this.url = $event;
    console.log(this.url);
  }

  onInputPic(files : FileList){
    const path = `banner/${Date.now()}_${files[0].name}`;

    const ref = this.storage.ref(path);

    this.task = this.storage.upload(path, files[0]);

    this.task.snapshotChanges().pipe(
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        console.log(this.downloadURL);
        this.UpdateArt()
        this.showPic = true
      }),
      ).subscribe(url => {
        if(url){
          console.log(url)
          this.showPic = true
        }
      })
    }

  getLoggedUser(){
    let user = JSON.parse(localStorage.getItem("currentUser"))
    return user
  }

  UpdateArt(){
    this.apollo.mutate({
      mutation:gql`
      mutation UpdateChannelArt($uid: String!, $na: String!){
        updateChannelArt(user_id: $uid, newArt: $na){
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
      `,variables:{
        uid: this.loggedUser.id,
        na: this.downloadURL
      },refetchQueries:[{
        query: gql`
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
      `,variables:{
        id: this.loggedUser.id
      }
      }]
    }).subscribe( result => {

    }),(error)=>{
      console.log(error);
      
    }
  }

  getUser(){
    this.apollo.watchQuery<any>({
      query: gql`
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
        id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.loggedUser = result.data.getUser
      this.isUserGet = true
      console.log(this.loggedUser);
    },(error) => {
      console.log(error);
    })
  }

}
