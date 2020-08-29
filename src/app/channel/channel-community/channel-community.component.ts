import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { gql, Apollo } from 'apollo-angular';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-channel-community',
  templateUrl: './channel-community.component.html',
  styleUrls: ['./channel-community.component.scss']
})
export class ChannelCommunityComponent implements OnInit {

  
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  url: string;
  id;
  user;
  files : File[] = [];
  showPic
  title;
  description;
  posts;

  constructor(private route:ActivatedRoute, private apollo: Apollo, private storage: AngularFireStorage, private db: AngularFirestore) {
    this.id = this.route.parent.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getUser();
    this.showPic = false
    this.GetUserPosts();
  }

  setUrl($event){
    this.url = $event;
    console.log(this.url); //video
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
          }
        }
      `,
      variables:{
        id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
    },(error) => {
      console.log(error);
    })
  }

  
  onInput(files : FileList){
    this.files.push(files.item(0));
  }
  onInputPic(files : FileList){
    // The storage path
    const path = `post/${Date.now()}_${files[0].name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, files[0]);

    this.task.snapshotChanges().pipe(
      // The file's download URL
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        console.log(this.downloadURL);
        this.showPic = true
      }),
      ).subscribe(url => {
        if(url){
          console.log(url)
          this.showPic = true
        }
      })
    }
    
    insert(){
      this.apollo.mutate({
        mutation:gql`
        mutation CreatePost($url: String, $title: String!, $desc: String!, $channel_id: String!){
          createPost(input:{
            picture_url: $url
            likes: 0
            dislikes: 0
            date: ""
            title: $title
            description: $desc
            channel_id: $channel_id
          }){
            id
            picture_url
            likes
            dislikes
            date
            title
            description
            channel_id
          }
        }
        `,variables:{
          url: this.downloadURL,
          title: this.title,
          desc: this.description,
          channel_id: this.id
        }
      }).subscribe( res => {
        let p = res.data
        console.log(p);
      }),(error) => {
        console.log(error);
      }
    }

    GetUserPosts(){
      this.apollo.watchQuery<any>({
        query:gql`
        query GetPostsByChannelId($id: String!){
          getPostsByChannelId(channel_id: $id){
            id
            picture_url
            likes
            dislikes
            date
            title
            description
            channel_id
          }
        }
        `,variables:{
          id: this.id
        }
      }).valueChanges.subscribe( result => {
        this.posts = result.data.getPostsByChannelId
      }),(error) => {
        console.log(error);
      }
    }

}
