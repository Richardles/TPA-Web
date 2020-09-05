import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
// import {MatSliderModule} from '@angular/material/slider';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  GET_COMMENTS = gql`
    query GetAllComments{
      comments{
        id
        comment
        user_id
        date
        likes
        dislikes
        replies_id
        video_id
      }
    }
    `
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
    }
  }
  `
  id;
  videos = [];
  playingVideo;
  userProfile;
  loggedUser;
  checked;
  comment;
  comments;
  updated;
  commentCount

  filteredComments = [];
  subsLabel;
  isSub;
  isOn;
  view;
  date;
  isLike;
  isDislike;
  playlist_modal;
  modal;
  shareOpen;
  lastKey: number = 12;
  observer: any
  sortModal;
  url;
  likeCount;
  totalLikes;
  likes
  dislikes
  
  constructor(private route: ActivatedRoute, private apollo: Apollo, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.likeCount = 0
    this.commentCount = 0;
    this.shareOpen = false
    this.playlist_modal = false
    this.modal = false
    this.isLike = false
    this.isDislike = false
    this.updated = false;
    this.sortModal = false
    let v = (document.getElementById('video-player') as HTMLVideoElement);
    this.checked = true;
    if(v != null){
      v.addEventListener('timeupdate', () => {
        if(v.ended){
          if(this.checked){
            this.router.navigate(['/video-player-page', this.videos[0].id])
            console.log("done")
          }
        }
      })
    }
    this.loggedUser = this.getLoggedUser();
    
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if(this.id !== null) {
        this.getVideoById();
        // this.getAllComments();
        this.getCommentsByVidId();
      }
    })
    // this.updateVideoView();
    this.subsLabel = "SUBSCRIBE"
    this.isSub = false
    this.isOn = false

    this.lastKey = 6;
    this.observer = new IntersectionObserver((entry)=>{
      if(entry[0].isIntersecting){
        let container = document.querySelector(".container");
        for(let i: number = 0; i< 4; i++){
          if(this.lastKey < this.videos.length){
            console.log(this.lastKey);
            let div = document.createElement("div");
            let v = document.createElement("app-related-video");
            div.setAttribute("class", "video-container");
            v.setAttribute("v", "this.videos[this.lastKey]");
            div.appendChild(v);
            container.appendChild(div);
            this.lastKey++;
          }
        }
      }
    
    });
    this.observer.observe(document.querySelector(".footer-scroll"));
    this.lastKey = 6;
    this.observer = new IntersectionObserver((entry)=>{
      if(entry[0].isIntersecting){
        let container = document.querySelector(".container");
        for(let i: number = 0; i< 4; i++){
          if(this.lastKey < this.filteredComments.length){
            console.log(this.lastKey);
            let div = document.createElement("div");
            let v = document.createElement("app-comment");
            div.setAttribute("class", "comment-container");
            v.setAttribute("item", "this.filteredComments[this.lastKey]");
            div.appendChild(v);
            container.appendChild(div);
            this.lastKey++;
          }
        }
      }
    
    });
    this.observer.observe(document.querySelector(".footer-scroll"));

    this.url = window.location.href
  }

  setLikeMetric(){

  }

  toChannel(){
    this.router.navigateByUrl("/refresh", {skipLocationChange: true}).then(()=>{
      this.router.navigateByUrl("/channel-app/" + this.userProfile.id + "/home");
    })
  }

  addToQueue(){
    // this.queued.emit(this.video)
  }

  routerToPlaylistModal(){
    if(this.playlist_modal){
      this.playlist_modal = false
      this.modal = false
    }else{
      this.playlist_modal = true
      this.modal = false
    }
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

  getTopComment(){
    for(let i = 0; i < this.filteredComments.length; i++){
      for(let j = 0; j < this.filteredComments.length-i-1; j++){
        if(this.filteredComments[j].likes < this.filteredComments[j+1].likes){
          let t = this.filteredComments[j]
          this.filteredComments[j] = this.filteredComments[j+1]
          this.filteredComments[j+1] = t
        }
      }
    }
  }

  getNewestComment(){
    for(let i = 0; i < this.filteredComments.length; i++){
      for(let j = 0; j < this.filteredComments.length-i-1; j++){
        if(this.filteredComments[j].date.toString() < this.filteredComments[j+1].date.toString()){
          let t = this.filteredComments[j]
          this.filteredComments[j] = this.filteredComments[j+1]
          this.filteredComments[j+1] = t
        }
      }
    }
  }

  toggleSort(){
    if(this.sortModal){
      this.sortModal = false
    }else{
      this.sortModal = true
    }
  }

  toggleShare(){
    if(this.shareOpen){
      this.shareOpen = false
    }else{
      this.shareOpen = true
    }
  }

  closeShare(){
    this.shareOpen= false
  }

  checkSub(){
    let sub = this.loggedUser.subscribed
    let check = this.userProfile.id
    if(sub.includes(check)){
      this.subsLabel = "SUBSCRIBED"
      this.isSub = true
    }else{
      this.subsLabel = "SUBSCRIBE"
      this.isSub = false
    }
  }
  checkLike(){
    let l = this.loggedUser.dislike_video
    let d = this.loggedUser.like_video
    if(l.includes(this.id.toString())){
      this.isDislike = true
      this.isLike = false
    }else if(d.includes(this.id.toString())){
      this.isDislike = false
      this.isLike = true
    }
  }

  like(){
    this.getUpdatedUser()
    let l = this.loggedUser.dislike_video
    if(l.includes(this.id.toString())){
      this.updateDislikeThenLike()
    }else{
      this.updateLike()
    }
  }

  dislike(){
    this.getUpdatedUser()
    let l = this.loggedUser.like_video
    if(l.includes(this.id.toString())){
      this.updateLikeThenDislike()
    }else{
      this.updateDislike()
    }
  }

  updateLike(){
    this.apollo.mutate({
      mutation:gql`
      mutation LikeVideo($uid: String!, $vid: Int!){
        updateLikeVideo(user_id: $uid, video_id: $vid){
          id
          name
          profile_picture
          subscriber
          email
          location
          premium
          like_video
          dislike_video
        }
      }
      `,variables:{
        uid: this.loggedUser.id,
        vid: this.playingVideo.id
      }
    }).subscribe( res => {
      console.log("liked");
    }),(error)=>{
      console.log(error);
    }
  }

  updateDislike(){
    this.apollo.mutate({
      mutation:gql`
      mutation DislikeVideo($uid: String!, $vid: Int!){
        updateDislikeVideo(user_id: $uid, video_id: $vid){
          id
          name
          profile_picture
          subscriber
          email
          location
          premium
          like_video
          dislike_video
        }
      }
      `,variables:{
        uid: this.loggedUser.id,
        vid: this.playingVideo.id
      }
    }).subscribe( res => {
      console.log("disliked");
    }),(error)=>{
      console.log(error);
    }
  }

  updateLikeThenDislike(){
    this.apollo.mutate({
      mutation:gql`
      mutation LikeVideo($uid: String!, $vid: Int!){
        updateLikeVideo(user_id: $uid, video_id: $vid){
          id
          name
          profile_picture
          subscriber
          email
          location
          premium
          like_video
          dislike_video
        }
      }
      `,variables:{
        uid: this.loggedUser.id,
        vid: this.playingVideo.id
      }
    }).subscribe( res => {
      this.updateDislike()
    }),(error)=>{
      console.log(error);
    }
  }

  updateDislikeThenLike(){
    this.apollo.mutate({
      mutation:gql`
      mutation DislikeVideo($uid: String!, $vid: Int!){
        updateDislikeVideo(user_id: $uid, video_id: $vid){
          id
          name
          profile_picture
          subscriber
          email
          location
          premium
          like_video
          dislike_video
        }
      }
      `,variables:{
        uid: this.loggedUser.id,
        vid: this.playingVideo.id
      }
    }).subscribe( res => {
      this.updateLike()
    }),(error)=>{
      console.log(error);
    }
  }

  toggleModal(){
    if(this.modal){
      this.modal = false
    }else{
      this.modal = true
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

  checkNotif(){
    if(this.loggedUser.notified_by.includes(this.playingVideo.userId)){
      this.isOn = true
    }else{
      this.isOn = false
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
        nid: this.playingVideo.userId
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
          notified_by
        }
      }
      `,variables:{
        uid: this.loggedUser.id,
        tid: this.userProfile.id
      },refetchQueries:[{
        query: this.GET_USER
        ,variables:{
          id: this.userProfile.id
        }
      }]
    }).subscribe( result => {

    }),(error) => {
      console.log(error);
    }
  }

  deletekeys(){
    document.onkeydown = function(event) {
    }
  }

  hotkeys(){
    var audio_element = (document.getElementById('video-player') as HTMLVideoElement);
    document.onkeydown = function(event) {
      switch (event.keyCode) {
        case 38:
              event.preventDefault();
              var audio_vol = (audio_element).volume;
              if (audio_vol!=1) {
                try {
                    var x = audio_vol + 0.02;
                    audio_element.volume = x;
                  }
                catch(err) {
                    audio_element.volume = 1;
                }
              }
            break;
        case 40:
              event.preventDefault();
              audio_vol = audio_element.volume;
              if (audio_vol!=0) {
                try {
                  var y = audio_vol - 0.02;
                  audio_element.volume = y;
                }
                catch(err) {
                    audio_element.volume = 0;
                }
                
              }
            break;
          case 74:
            event.preventDefault();
            audio_element.currentTime -= 10;
              break;
          case 37:
            event.preventDefault();
            audio_element.currentTime -= 5;
              break;
          case 75:
            event.preventDefault();
            audio_element.paused == false ? audio_element.pause() : audio_element.play();
            break;
          case 76:
            event.preventDefault();
            audio_element.currentTime += 10;
              break;
          case 39:
            event.preventDefault();
            audio_element.currentTime += 5;
              break;
          case 77:
            event.preventDefault();
            if(audio_element.muted){
              audio_element.muted = false
            }else{
              audio_element.muted = true
            }
              break;
          case 70:
            event.preventDefault();
            var vid = (document.getElementById('video-player') as HTMLVideoElement);
            vid.requestFullscreen();
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
          playlist_id
          category
          audience
          visibility
          premium
          date
        }
      }
      `,
    }).valueChanges.subscribe(result => {
      this.videos = result.data.videos
        console.log(this.videos)
        this.videos = this.videos.filter(vid => vid.id != this.playingVideo.id);
      console.log(this.videos)
    },(error) => {
      console.log(error);
    })
  }

  updateVideoView(){
    console.log(this.playingVideo);
    this.apollo.mutate({
      mutation:gql`
      mutation UpdateVideoView($id: Int!, $view: Int!){
        updateVideoView(id: $id, view: $view){
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
          id: this.id,
          view: this.playingVideo.views + 1
      }
    }).subscribe( data  => {
      console.log("success update");
    },(error) => {
      console.log('there was an error sending the query', error);
      console.log(this.id)
      console.log(this.playingVideo.url)
      console.log(this.playingVideo.title)
      console.log(this.playingVideo.description)
      console.log(this.playingVideo.thumbnail)
      console.log(this.playingVideo.userId)
      console.log(this.playingVideo.views)
      console.log(this.playingVideo.playlist_id)
      console.log(this.playingVideo.category)
      console.log(this.playingVideo.audience)
      console.log(this.playingVideo.visibility)
      console.log(this.playingVideo.premium)
    })
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
          date
        }
      }
      `,
      variables:{
        id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.playingVideo = result.data.getVideo;
      this.view = this.formatter(this.playingVideo.views, 1)
      this.totalLikes = this.playingVideo.likes + this.playingVideo.dislikes
      this.likeCount = this.playingVideo.likes
      this.likes = this.formatter(this.playingVideo.likes, 1)
      this.dislikes = this.formatter(this.playingVideo.dislikes, 1)
      this.getUser();
      // this.getVideo();
      if(!this.updated){
        this.updateVideoView()
        this.updated = true
      }
      this.setUploadDate()
    },(error) => {
      console.log(error);
    })
  }

  getVideosByCategory(){
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
          date
        }
      }
      `,variables:{
        cate: this.playingVideo.category
      }
    }).valueChanges.subscribe( result => {
      this.videos = result.data.getVideosByCategory

    }),(error) => {
      console.log(error);
    }
  }

  setUploadDate(){
    let d1 = this.playingVideo.date
    console.log(d1);
    let year = d1[0]+d1[1]+d1[2]+d1[3]
    let month = d1[5]+d1[6]
    let date = d1[8]+d1[9]

    let y = parseInt(year)
    let m = parseInt(month)
    let d = parseInt(date)
    console.log(y+" "+m+" "+d);

    var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    
    var selectedMonth = months[m-1];
    this.date = selectedMonth+" "+d+", "+y
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
        id: this.playingVideo.userId
      }
    }).valueChanges.subscribe(result => {
      this.userProfile = result.data.getUser
      if(this.loggedUser != null){
        this.getUpdatedUser()
        this.checkSub()
      }else{
        this.getVideosByCategory()
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
      this.checkNotif()
      this.checkLike()
      if(this.loggedUser.premium_type != "monthly" && this.loggedUser.premium_type != "annually"){
        this.getNonPremium()
      }else{
        // this.getVideo()
        this.getVideosByCategory()
      }
    },(error) => {
      console.log(error);
    })
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
      this.videos = res.data.getNotPremiumVideos
      this.filter()
      console.log(this.videos.length);
    }),(error)=>{
      console.log(error);
    }
  }

  filter(){
    let temp = []
    for(let i = 0; i < this.videos.length; i++){
      if(this.videos[i].category == this.playingVideo.category){
        temp.push(this.videos[i])
      }
    }
    this.videos = temp
  }



  getLoggedUser(){
    let user = JSON.parse(localStorage.getItem("currentUser"))
    return user
  }

  autoPlay(event){
    if(event.target.checked){
      this.checked = true;
    }else{
      this.checked = false;
    }
    console.log(this.checked);
    
  }

  submitComment(){
    console.log(this.comment + "  " + this.loggedUser.id)
    console.log(this.playingVideo.id)
    this.apollo.mutate({
      mutation: gql`
        mutation CreateComment($comment: String!, $userId: String!, $vidId: Int){
          createComment(input:{
            comment: $comment,
            user_id: $userId,
            likes: 0,
            dislikes: 0,
            replies_id: 0,
            video_id: $vidId
          }){
            id
            comment
            user_id
            date
            likes
            dislikes
            replies_id
            video_id
          }
        }
      `,variables:{
        comment: this.comment.toString(),
        userId: this.loggedUser.id.toString(),
        vidId: this.playingVideo.id
      },
      refetchQueries:[{
        query: this.GET_COMMENTS
      }]
    }).subscribe( data  => {

    },(error) => {
      console.log('there was an error sending the query', error);
    })
  }

  getAllComments(){
    this.apollo.watchQuery<any>({
      query: gql`
      query GetAllComments{
        comments{
          id
          comment
          user_id
          date
          likes
          dislikes
          replies_id
          video_id
        }
      }
      `
    }).valueChanges.subscribe(result => {
      this.comments = result.data.comments
    }),(error) => {
      console.log(error);
    }
  }

  getCommentsByVidId(){
    this.apollo.watchQuery<any>({
      query:gql`
      query GetCommentsByVideoId($vid: Int!){
        getCommentByVideoId(vid_id: $vid){
          id
          comment
          user_id
          date
          likes
          dislikes
          replies_id
          video_id
        }
      }
      `,variables:{
        vid: this.id
      }
    }).valueChanges.subscribe(result => {
      this.comments = result.data.getCommentByVideoId
      this.commentCount = this.comments.length
      this.filterComment()
    }),(error) => {
      console.log(error);
    }
  }

  filterComment(){
    for(let i = 0; i < this.comments.length; i++){
      if(this.comments[i].replies_id == 0){
        this.filteredComments.push(this.comments[i])
      }
    }
    console.log(this.filteredComments);
  }

  formatter(num, digits) {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "B" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
  }

}
