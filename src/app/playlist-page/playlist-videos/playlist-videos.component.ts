import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-playlist-videos',
  templateUrl: './playlist-videos.component.html',
  styleUrls: ['./playlist-videos.component.scss']
})
export class PlaylistVideosComponent implements OnInit {
  @Input() video;
  @Output() videoId = new EventEmitter<number>();
  userProfile;
  modal;
  playlist_modal;
  views;
  canEdit;
  loggedUser;
  playlist;
  id;
  type;
  durString;

  constructor(private apollo:Apollo, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.durString = "00:00";
    this.route.params.subscribe(param => {
      this.id = param['id'];
      console.log(this.id);
    })
    this.GetPlaylistById()

    this.getUser()
    this.modal = false
    this.views = this.formatter(this.video.views, 1);

    if(this.video.visibility == "Public"){
      this.type = "Public"
    }else if(this.video.visibility == "Private"){
      this.type = "Private"
    }
    if(this.video.premium == "Premium"){
      this.type = "Premium"
    }
  }

  addToQueue(){
    var temp = JSON.parse(localStorage.getItem("storedQueue"));
    var a = [];
    if (temp == null)
    {
      a.push(this.video.id);
      localStorage.setItem("storedQueue",JSON.stringify(a));
    }
    else
    {
      temp.forEach(element => {
        a.push(element);
      });
      a.push(this.video.id);
      localStorage.setItem("storedQueue",JSON.stringify(a));
    }
  }

  setDur(event){
    let sec = event.target.duration
    sec = Math.floor(sec)
    if(sec < 60){
      if(sec < 10){
        this.durString ="0:0"+Math.floor(sec).toString()
      }else{
        this.durString = "0:"+Math.floor(sec).toString()
      }
    }else{
      let min = Math.floor(sec/60)
      sec = sec%60
      if(min < 60){
        if(sec < 10){
          this.durString = min+":0"+Math.floor(sec)
        }else{
          this.durString = min+":"+Math.floor(sec)
        }
      }else{
        let hour = Math.floor(min/60)
        min = min%60
        if(min < 10){
          if(sec < 10){
            this.durString = hour+":0"+min+":0"+Math.floor(sec)
          }else{
            this.durString = hour+":0"+min+":"+Math.floor(sec)
          }
        }else{
            if(sec < 10){
              this.durString = hour+":"+min+":0"+Math.floor(sec)
            }else{
              this.durString = hour+":"+min+":"+Math.floor(sec)
            }
        }
      }
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
      this.getLoggedUser()
    }),(error) => {
      console.log(error);
    }
  }

  getLoggedUser(){
    this.loggedUser = JSON.parse(localStorage.getItem("currentUser"))
    if(this.loggedUser != null){
      if(this.playlist.userId == this.loggedUser.id){
        this.canEdit = true
      }else{
        this.canEdit = false
      }
    }
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

  toggleModal(){
    if(this.modal){
      this.modal = false
    }else{
      this.modal = true
    }
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

  removeVideo(){
    this.videoId.emit(this.video.id);
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
        id: this.video.userId
      }
    }).valueChanges.subscribe(result => {
      this.userProfile = result.data.getUser
    },(error) => {
      console.log(error);
    })
  }

}
