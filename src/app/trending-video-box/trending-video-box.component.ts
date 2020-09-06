import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trending-video-box',
  templateUrl: './trending-video-box.component.html',
  styleUrls: ['./trending-video-box.component.scss']
})
export class TrendingVideoBoxComponent implements OnInit {
  
  @Output() passVideo = new EventEmitter<any>()
  @Input() video: any;
  userId;
  modal;
  playlist_modal;
  view
  type

  constructor(private apollo: Apollo, private router:Router) { }

  ngOnInit(): void {
    console.log(this.video)
    if(this.video.userId != null){
      console.log("getUser")
      this.getUserById()
    }
    this.modal = false;
    this.playlist_modal = false;
    this.view = this.formatter(this.video.views, 1)
    if(this.video.visibility == "Public"){
      this.type = "Public"
    }else if(this.video.visibility == "Private"){
      this.type = "Private"
    }
    if(this.video.premium == "Premium"){
      this.type = "Premium"
    }
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
