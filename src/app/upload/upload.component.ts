import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  dropped = false;
  detailPg = false;
  videoTitle = "";
  videoDesc = "";
  playlistTitle = "";
  playlistDesc = "";
  playlistVisibility = "";
  playlists;
  playlistId;
  audience;
  category;
  visibility;
  premium;
  createdObj;
  loggedUser;
  
  validateTitle(){
    if(this.videoTitle.length > 0){
      this.detailPg = true;
    }
  }

  uploadToDb(){
    this.createVideo();
  }

  files : File[] = [];
  url: string;
  downloadURL: string;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;

  onInput(files : FileList){
    this.files.push(files.item(0));
    this.dropped = true;
  }
  onInputThumb(files : FileList){
    const path = `thumbnail/${Date.now()}_${files[0].name}`;

    const ref = this.storage.ref(path);

    this.task = this.storage.upload(path, files[0]);

    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        console.log(this.downloadURL);
      }),
    );
  }
  onDrop(files: File[]) {
    files.forEach(file => {
      this.files.push(file);
    });
    this.dropped = true;
  }

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private apollo: Apollo) { }
    setUrl($event){
    this.url = $event;
    console.log(this.url); //video
    }
  
  ngOnInit(): void {
    this.loggedUser = this.getLoggedUser()
    if(this.loggedUser != null){
      this.getPlayListByUser();
    }
    this.playlistVisibility = "Public"
    this.audience = "All ages"
    this.category = "Music"
    this.visibility = "Private"
    this.premium = "Not premium"
  }

  getLoggedUser(){
    let user = JSON.parse(localStorage.getItem("currentUser"))
    if(user != null){
      return user
    }
  }

  getUserId(){
    if(this.loggedUser != null){
      return this.loggedUser.id
    }
  }

  createVideo(){
    this.apollo.mutate({
      mutation: gql`
      mutation CreateVideo($url: String!, $title: String!, $desc: String, $thumb: String, $userID: String, $playID: Int!, $category: String, $audi: String, $visi: String, $pre: String){
        createVideo(input:{
          url: $url
          title: $title
          likes: 0,
          dislikes: 0,
          description: $desc
          thumbnail: $thumb
          userId: $userID
          views: 0
          playlist_id: $playID
          category: $category
          audience: $audi
          visibility: $visi
          premium: $pre
          date: ""
        }){
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
          date
        }
      }
      `,variables:{
        url: this.url,
        title: this.videoTitle,
        desc: this.videoDesc,
        thumb: this.downloadURL,
        userID: this.getUserId(),
        playID: parseInt(this.playlistId),
        audi: this.audience,
        visi: this.visibility,
        pre: this.premium,
        category: this.category
      }
    }).subscribe(({ data }) => {
      this.createdObj = data["createVideo"]
      console.log('got data', data);
      if(this.createdObj.playlist_id != 0){
        this.updatePlaylist()
        console.log(this.playlistId);
      }
      this.uploadActivity()
      location.href = "/home";
    },(error) => {
      console.log('there was an error sending the query', error);
    })
  }

  uploadActivity(){
    this.apollo.mutate({
      mutation:gql`
      mutation CreateActivity($uid: String!, $vid: Int, $pid: Int){
        createActivity(input:{
          user_id: $uid,
          video_id: $vid,
          post_id: $pid
        }){
          id
          user_id
          video_id
          post_id
        }
      }
      `,variables:{
        uid: this.getUserId(),
        vid: this.createdObj.id,
        pid: 0
      }
    }).subscribe( result => {

    }),(error) => {
      console.log(error);
    }
  }

  updatePlaylist(){
    console.log(this.playlistId);
    console.log(this.createdObj.id);
    this.apollo.mutate({
      mutation: gql`
      mutation UpdatePlaylistVideo($play_id: Int!, $vid_id: Int!){
        updateVideoInPlaylist(playlist_id: $play_id, video_id: $vid_id){
          id
          title
          total_videos
          views
          last_updated
          view_type
          description
          userId
          videos_id
        }
      }
      `,variables:{
        play_id: this.playlistId,
        vid_id: this.createdObj.id
      }
    }).subscribe(res => {
      console.log(res.data)
    }),(error) => {
      console.log(error);
    }
  }

  createPlaylist(){
    this.apollo.mutate({
      mutation: gql`
      mutation CreatePlaylist($title: String!, $view: String!, $desc: String!, $userId: String!){
        createPlaylist(input:{
          title: $title,
          total_videos: 1,
          views: 0,
          view_type: $view,
          description: $desc,
          userId: $userId,
          videos_id: ""
        }){
          id
          title
          total_videos
          views
          last_updated
          view_type
          description
          userId
          videos_id
        }
      }
      `,variables:{
          title: this.playlistTitle,
          view: this.playlistVisibility,
          desc: this.playlistDesc,
          userId: this.getUserId(),
      }
      ,refetchQueries: [{
          query: gql`
          query GetPlaylistByUser($id: String!){
            getPlaylistByUser(id: $id){
              id
              title
              total_videos
              views
              last_updated
              view_type
              description
              userId
              videos_id
            }
          }
          `,variables:{
            id: this.getUserId()
          }
      }]
    }).subscribe(({ data }) => {

    },(error) => {
      console.log('there was an error sending the query', error);
    })
  }

  getPlayListByUser(){
    this.apollo.watchQuery<any>({
      query: gql`
      query GetPlaylistByUser($id: String!){
        getPlaylistByUser(id: $id){
          id
          title
          total_videos
          views
          last_updated
          view_type
          description
          userId
          videos_id
        }
      }
      `,variables:{
        id: this.getUserId()
      }
    }).valueChanges.subscribe(({ data }) => {
        this.playlists = data.getPlaylistByUser
        console.log(this.getUserId());
        console.log(this.playlists)
    },(error) => {
      console.log('there was an error sending the query', error);
    })
  }

  log(){
    this.playlistId = (<HTMLSelectElement>document.getElementById("playlists")).value;
    console.log(this.playlistId);
  }
  
  upCategory(){
    this.category = (<HTMLSelectElement>document.getElementById("categoryLists")).value;
    console.log(this.category);
  }
  
}
