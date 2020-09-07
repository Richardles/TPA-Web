import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-box',
  templateUrl: './video-box.component.html',
  styleUrls: ['./video-box.component.scss']
})
export class VideoBoxComponent implements OnInit {
  @Output() passVideo = new EventEmitter<any>()
  @Input() video: any;
  @Output() queued = new EventEmitter<any>()
  userId;
  modal;
  playlist_modal;
  view;
  duration;
  deleteAble;
  loggedUser;
  durString;
  type;
  constructor(private apollo: Apollo, private router:Router) { }

  ngOnInit(): void {
    this.durString = "00:00"
    this.getLoggedUser()
    this.deleteAble = false
    console.log(this.video)
    if(this.video.userId != null){
      console.log("getUser")
      this.getUserById()
    }
    this.modal = false;
    this.playlist_modal = false;
    console.log(this.video.date);
    this.view = this.formatter(this.video.views, 1)

    var vid = document.createElement("vid");
    this.checkDelete()
    if(this.video.visibility == "Public"){
      this.type = "Public"
    }else if(this.video.visibility == "Private"){
      this.type = "Private"
    }
    if(this.video.premium == "Premium"){
      this.type = "Premium"
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

  checkDelete(){
    if(this.loggedUser != null){
      if(this.video.userId == this.loggedUser.id){
        this.deleteAble = true
      }
    }
  }

  emitVid(){
    this.queued.emit(this.video)
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

  getLoggedUser(){
    this.loggedUser = JSON.parse(localStorage.getItem("currentUser"))
  }

  deleteVid(){
    this.apollo.mutate({
      mutation:gql`
      mutation DeleteVideo($id: Int!){
        deleteVideo(id: $id)
      }
      `,variables:{
        id: this.video.id
      }
    }).subscribe(res=>{

    }),(error) => {
      console.log(error);
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

  toggleModal(){
    if(this.modal){
      this.modal = false
    }else{
      this.modal = true
    }
  }

  
  toChannel(){
    this.router.navigateByUrl("/channel-app/" + this.userId.id + "/home");
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

  showPlaylistModal(){
    this.passVideo.emit(this.video);
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
