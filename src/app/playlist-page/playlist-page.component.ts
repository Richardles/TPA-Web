import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { title } from 'process';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-playlist-page',
  templateUrl: './playlist-page.component.html',
  styleUrls: ['./playlist-page.component.scss']
})
export class PlaylistPageComponent implements OnInit {
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
  playlist;
  playlistVideos;
  video;
  videosObj = [];
  playlistThumbnail;
  vidId;
  userPlaylist;
  totalVids;
  editing;
  canSubscribe;

  isUpdatingTitle;
  selectedVis;
  newTitle;
  newCategory;
  newDesc;
  isMore;
  loggedUser;
  isSub;
  subsLabel;
  isOn;
  lastKey;
  observer: any;
  open;
  url;
  shareOpen;
  canEdit;

  constructor(private route:ActivatedRoute, private apollo: Apollo, private router: Router) { 
    this.route.params.subscribe(param => {
      this.id = param['id'];
      console.log(this.id);
    })}

  ngOnInit(): void {
    this.canSubscribe = false
    this.canEdit = false
    this.url = window.location.href
    this.shareOpen = false
    this.lastKey = 6;
    this.open=false
    this.isOn = false
    this.isSub = false
    this.subsLabel = "SUBSCRIBE"
    this.GetPlaylistById()
    this.editing = false
    this.isUpdatingTitle = false
    this.isMore = false;
    // this.getLoggedUser()
    this.observer = new IntersectionObserver((entry)=>{
      if(entry[0].isIntersecting){
        let container = document.querySelector(".right");
        for(let i: number = 0; i< 4; i++){
          if(this.lastKey < this.videosObj.length){
            console.log(this.lastKey);
            let div = document.createElement("div");
            let v = document.createElement("app-playlist-videos");
            div.setAttribute("class", "video-container");
            v.setAttribute("video", "this.videosObj[this.lastKey]");
            div.appendChild(v);
            container.appendChild(div);
            this.lastKey++;
          }
        }
      }
    
    });
    this.observer.observe(document.querySelector(".footer-scroll"));
  }

  checkSub(){
    let sub = this.loggedUser.subscribed
    let check = this.playlist.userId
    if(sub.includes(check)){
      this.subsLabel = "SUBSCRIBED"
      this.isSub = true
      console.log(this.loggedUser.id);
    }else{
      this.subsLabel = "SUBSCRIBE"
      this.isSub = false
      console.log("no");
    }
  }

  toggleSort(){
    if(this.open){
      this.open = false
    }else{
      this.open = true
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

  copy(){
    var u = document.createElement("input")
    this.url = window.location.href
    document.body.appendChild(u)
    u.value = this.url
    u.select()
    document.execCommand("copy")
    document.body.removeChild(u)
  }

  closeShare(){
    if(this.shareOpen){
      this.shareOpen = false
    }else{
      this.shareOpen = true
    }
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
        uid: this.loggedUser.id,
        nid: this.userPlaylist.id
      }
    }).subscribe( result => {

    }),(error)=>{
      console.log(error);
    }
  }

  toChannel(){
    this.router.navigateByUrl("/channel-app/" + this.userPlaylist.id + "/home");
  }

  toggleMore(){
    if(this.isMore){
      this.isMore = false
    }else{
      this.isMore = true
    }
  }

  removeAll(){
    this.toggleMore()
    this.EmptyPlaylist()
  }

  getLoggedUser(){
    this.loggedUser = JSON.parse(localStorage.getItem("currentUser"))
    if(this.loggedUser != null){
      if(this.playlist.userId == this.loggedUser.id){
        this.canEdit = true
        this.canSubscribe = false
      }else{
        this.canSubscribe = true;
        this.canEdit = false;
        (<HTMLInputElement>document.getElementById("visibility")).disabled = true;
      }
    }
  }

  subscribe(){
    if(this.loggedUser != null){
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
            notified_by
          }
        }
        `,variables:{
          uid: this.loggedUser.id,
          tid: this.userPlaylist.id
        },refetchQueries:[{
          query: this.GET_USER
          ,variables:{
            id: this.userPlaylist.id
          }
        }]
      }).subscribe( result => {
        
      }),(error) => {
        console.log(error);
        console.log(this.loggedUser.id);
        
      }
    }
  }

  EmptyPlaylist(){
    this.apollo.mutate({
      mutation:gql`
      mutation EmptyPlaylist($id: Int!){
        emptyPlaylist(playlist_id: $id){
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
        id: this.id
      }
    }).subscribe( res => {

    }),(error) => {
      console.log(error);
    }
  }

  selectVis(){
    if(this.playlist.view_type == "Public"){
      this.selectedVis = 0
    }else if(this.playlist.view_type == "Private"){
      this.selectedVis = 2
    }else{
      this.selectedVis = 1
    }
    console.log(this.playlist.view_type);
  }

  toggleEditTitle(){
    if(this.isUpdatingTitle){
      this.isUpdatingTitle = false
    }else{
      this.isUpdatingTitle = true
    }
  }

  toggleEditDesc(){
    if(this.editing){
      this.editing = false
    }else{
      this.editing = true
    }
  }

  updateTitle(){
    this.UpdateTitle()
    this.toggleEditTitle()
  }

  removeVideo(event){
    console.log(event);

    this.apollo.mutate({
      mutation:gql`
      mutation UpdatePlaylistVideo($id: Int!, $vid: Int!){
        updateVideoInPlaylist(playlist_id: $id, video_id: $vid){
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
        id: this.id,
        vid: event
      }
    }).subscribe(result => {

    }),(error) => {
      console.log(error);
    }
  }

  GetPlaylistById(){
    this.apollo.watchQuery<any>({
      query: gql`
      query GetPlaylistById($id: Int!){
        getPlaylist(id: $id){
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
        id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.playlist = result.data.getPlaylist
      this.GetThumbnail();
      this.selectVis();
      this.getLoggedUser();
    }),(error) => {
      console.log(error);
    }
  }

  GetThumbnail(){
    this.playlistVideos = this.playlist.videos_id.toString().split(',').map(Number);
    this.vidId = this.playlistVideos[0];
    this.totalVids = this.playlistVideos.length;
    this.getVideoById()
  }

  getVideoById(){
    this.apollo.watchQuery<any>({
      query: gql `
      query GetVideo($id: Int!){
        getVideo(id: $id){
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
      variables:{
        id: this.vidId
      }
    }).valueChanges.subscribe(result => {
      this.video = result.data.getVideo;
      this.playlistThumbnail = this.video.thumbnail
      this.getUser();
    },(error) => {
      console.log(error);
    })
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
            like_comment
            dislike_comment
            subscribed
            notified_by
          }
        }
      `,
      variables:{
        id: this.playlist.userId
      }
    }).valueChanges.subscribe(result => {
      this.userPlaylist = result.data.getUser

      if(this.loggedUser != null){
        this.getUpdatedUser()
      }else{
        this.getNonPremium()
      }
    },(error) => {
      console.log(error);
    })
  }
  getUpdatedUser(){
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
            like_comment
            dislike_comment
            subscribed
            notified_by
            like_video
            dislike_video
            like_post
            dislike_post
            premium_type
          }
        }
      `,
      variables:{
        id: this.loggedUser.id
      }
    }).valueChanges.subscribe(result => {
      this.loggedUser = result.data.getUser
      console.log(this.loggedUser);
      this.checkSub()
      this.pushVideos()
    },(error) => {
      console.log(error);
    })
  }

  pushVideos(){
    for(let i = 0; i < this.playlistVideos.length; i++){
      this.apollo.watchQuery<any>({
        query: gql `
        query GetVideo($id: Int!){
          getVideo(id: $id){
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
        `,
        variables:{
          id: this.playlistVideos[i]
        }
      }).valueChanges.subscribe(result => {
        let v = result.data.getVideo
        if(this.loggedUser.premium_type != "monthly" && this.loggedUser.premium_type != "annually"){
          if(v.premium == "Not premium"){
            if(v.userId == this.loggedUser.id){
              this.videosObj.push(result.data.getVideo);
            }else{
              if(v.visibility == "Public"){
                this.videosObj.push(result.data.getVideo);
              }
            }
          }
        }else{
          if(v.userId == this.loggedUser.id){
            this.videosObj.push(result.data.getVideo);
          }else{
            if(v.visibility == "Public"){
              this.videosObj.push(result.data.getVideo);
            }
          }
        }
      },(error) => {
        console.log(error);
      })
    }
  }

  getNonPremium(){
    this.apollo.query<any>({
      query:gql`
      query GetNotPremium{
        getNotPremiumVideos{
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
      `
    }).subscribe(res=>{
      let v = res.data.getNotPremiumVideos
      this.filterVids(v)
    }),(error)=>{
      console.log(error);
    }
  }

  filterVids(v){
    let p = this.playlistVideos
    console.log(p);
    console.log(v);
    
    for(let i = 0; i < v.length; i++){
      if(p.includes(v[i].id) && v[i].visibility == "Public"){
        this.videosObj.push(v[i])
      }
    }
    console.log(this.videosObj);
    
  }

  sortVid(){
    for(let i = 0; i < this.videosObj.length; i++){
      for(let j = 0; j < this.videosObj.length-i-1; j++){
        if(this.videosObj[j].views < this.videosObj[j+1].views){
          let t = this.videosObj[j]
          this.videosObj[j] = this.videosObj[j+1]
          this.videosObj[j+1] = t
        }
      }
    }
  }
  sortPublished(){
    for(let i = 0; i < this.videosObj.length; i++){
      for(let j = 0; j < this.videosObj.length-i-1; j++){
        if(this.videosObj[j].date > this.videosObj[j+1].date){
          let t = this.videosObj[j]
          this.videosObj[j] = this.videosObj[j+1]
          this.videosObj[j+1] = t
        }
      }
    }
  }
  sortAdded(){
    for(let i = 0; i < this.videosObj.length; i++){
      for(let j = 0; j < this.videosObj.length-i-1; j++){
        if(this.videosObj[j].date < this.videosObj[j+1].date){
          let t = this.videosObj[j]
          this.videosObj[j] = this.videosObj[j+1]
          this.videosObj[j+1] = t
        }
      }
    }
  }

  UpdateTitle(){
    this.apollo.mutate({
      mutation:gql`
      mutation UpdatePlaylistTitle($id: Int!, $title: String!){
        updatePlaylistTitle(id: $id,newTitle: $title){
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
        id: this.id,
        title: this.newTitle
      }
    }).subscribe(result => {
      this.videosObj = [];
      this.pushVideos()
    }),(error) => {
      console.log(error);
    }
  }

  UpdatePlayVisibility(){
    this.newCategory = (<HTMLSelectElement>document.getElementById("visibility")).value;
    this.apollo.mutate({
      mutation:gql`
      mutation UpdatePlaylistVisibility($id: Int!, $vis: String!){
        updatePlaylistVisibility(id: $id,newVis: $vis){
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
        id: this.id,
        vis: this.newCategory
      }
    }).subscribe(result => {

    }),(error) => {
      console.log(error);
    }
  }

  UpdatePlayDesc(){
    this.apollo.mutate({
      mutation:gql`
      mutation UpdatePlaylistDescription($id: Int!, $desc: String!){
        updatePlaylistDescription(id: $id, newDesc: $desc){
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
        id: this.id,
        desc: this.newDesc
      }
    }).subscribe(result => {
      this.toggleEditDesc()
    }),(error) => {
      console.log(error);
    }
  }

}
