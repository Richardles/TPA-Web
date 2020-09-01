import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
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
  videos;
  playingVideo;
  userProfile;
  loggedUser;
  checked;
  comment;
  comments;
  updated;

  filteredComments = [];
  subsLabel;
  isSub;
  isOn;
  view;
  
  constructor(private route: ActivatedRoute, private apollo: Apollo, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.updated = false;
    let v = (document.getElementById('video-player') as HTMLVideoElement);
    this.checked = true;
    v.addEventListener('timeupdate', () => {
      if(v.ended){
        if(this.checked){
          this.router.navigate(['/video-player-page', this.videos[0].id])
          console.log("done")
        }
      }
    })
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
      mutation UpdateVideo($id: Int!, $url: String!, $title: String!, $desc: String!, $thumb: String!, $uid: String!, $view: Int!,
        $playlist_id: Int!, $cate: String!, $audience: String!, $vis: String!, $prem: String!, $date: String!){
        updateVideo(id: $id, input:{
          url: $url,
          title: $title,
          description: $desc,
          thumbnail: $thumb,
          userId: $uid,
          views: $view,
          playlist_id: $playlist_id,
          category: $cate,
          audience: $audience,
          visibility: $vis,
          premium: $prem,
          date: $date
        }
        ){
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
          url: this.playingVideo.url,
          title: this.playingVideo.title,
          desc: this.playingVideo.description,
          thumb: this.playingVideo.thumbnail,
          uid: this.playingVideo.userId,
          view: this.playingVideo.views + 1,
          playlist_id: 0,
          cate: this.playingVideo.category,
          audience: this.playingVideo.audience,
          vis: this.playingVideo.visibility,
          prem: this.playingVideo.premium,
          date: this.playingVideo.date
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
      this.getUser();
      this.getVideo();
      if(!this.updated){
        this.updateVideoView()
        this.updated = true
      }
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
        id: this.playingVideo.userId
      }
    }).valueChanges.subscribe(result => {
      this.userProfile = result.data.getUser
      this.getUpdatedUser()
      this.checkSub()
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
          }
        }
      `,
      variables:{
        id: this.loggedUser.id
      }
    }).valueChanges.subscribe(result => {
      this.loggedUser = result.data.getUser
      this.checkNotif()
    },(error) => {
      console.log(error);
    })
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
