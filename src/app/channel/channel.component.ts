import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  GET_USER = gql`
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
    }
  }
  `


id;
loggedUser;
isUserGet;

task: AngularFireUploadTask;
percentage: Observable<number>;
snapshot: Observable<any>;
downloadURL: string;
url: string;
showPic;
isSub;
isOn;
subsLabel;
visitor;
canEdit;

  constructor(private route: ActivatedRoute, private apollo: Apollo, private storage: AngularFireStorage, private db: AngularFirestore, private router:Router) {
    this.route.params.subscribe(param => {
      this.id = param['id'];
      console.log(this.id);
    })
  }

  ngOnInit(): void {
    this.canEdit = false
    this.subsLabel="SUBSCRIBE"
    this.isOn = false
    this.isSub = false
    this.isUserGet = false
    if(!this.isUserGet){
      this.getUser()
    }
    this.visitor = this.getLoggedUser()
    if(this.visitor != null){
      this.getUpdatedUser()
      if(this.visitor == this.id){
        this.canEdit = true
      }
    }
  }

  toChannelP(){
    this.router.navigateByUrl("/refresh", {skipLocationChange: true}).then(()=>{
      this.router.navigateByUrl("/channel-app/" + this.id + "/home");
    })
  }

  checkSub(){
    let sub = this.visitor.subscribed
    let check = this.id
    if(sub.includes(check)){
      this.subsLabel = "SUBSCRIBED"
      this.isSub = true
    }else{
      this.subsLabel = "SUBSCRIBE"
      this.isSub = false
    }
  }

  checkNotif(){
    console.log(this.visitor.notified_by);
    console.log(this.id);
    if(this.visitor.notified_by.includes(this.id)){
      this.isOn = true
    }else{
      this.isOn = false
    }
  }

  toggleNotif(){
    if(this.isOn){
      this.isOn = false
    }else{
      this.isOn = true
    }
    this.updateNotif()
  }

  updateNotif(){
    this.apollo.mutate({
      mutation:gql`
      mutation UpdateUserNotify($uid: String!, $nid: String!){
        updateUserNotify(user_id: $uid,notif_id: $nid){
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
        }
      }
      `,variables:{
        uid: this.visitor.id,
        nid: this.id
      }
    }).subscribe( result => {

    }),(error)=>{
      console.log(error);
    }
  }

  subscribe(){
    this.apollo.mutate({
      mutation:gql`
      mutation UpdateSubscriber($uid: String!, $tid: String!){
        updateSubscriber(user_id: $uid, target_id: $tid){
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
        uid: this.visitor.id,
        tid: this.id
      },refetchQueries:[{
        query: this.GET_USER
        ,variables:{
          id: this.id
        }
      }]
    }).subscribe( result => {
      
    }),(error) => {
      console.log(error);
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
  getUpdatedUser(){
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
            notified_by
          }
        }
      `,
      variables:{
        id: this.visitor.id
      }
    }).valueChanges.subscribe(result => {
      this.visitor = result.data.getUser
      this.checkSub()
      this.checkNotif()
    },(error) => {
      console.log(error);
    })
  }

  getVisitor(){
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
            notified_by
          }
        }
      `,
      variables:{
        id: this.loggedUser.id
      }
    }).valueChanges.subscribe(result => {
      this.visitor = result.data.getUser
      this.checkSub()
    },(error) => {
      console.log(error);
    })
  }

}
