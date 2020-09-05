import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-channel-about',
  templateUrl: './channel-about.component.html',
  styleUrls: ['./channel-about.component.scss']
})
export class ChannelAboutComponent implements OnInit {

id;
user;
isUpdating;
desc;
date;
isUpdatingLink;
link;
views: number = 0;
stringView
loggedUser;
canEdit;

  constructor(private route: ActivatedRoute, private apollo: Apollo) { }

  ngOnInit(): void {
    this.canEdit = false
    this.id = this.route.parent.snapshot.paramMap.get('id');
    this.getUser()
    this.isUpdating = false;
    this.getLoggedUser()
    if(this.loggedUser){
      if(this.loggedUser.id == this.id){
        this.canEdit = true
      }
    }
  }

  getLoggedUser(){
    this.loggedUser = JSON.parse(localStorage.getItem("currentUser"))
  }

  setUploadDate(){
    let d1 = this.user.channel_join_date
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
          }
        }
      `,
      variables:{
        id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser;
      this.setUploadDate()
      this.getVideosOfUserId()
    },(error) => {
      console.log(error);
    })
  }

  toggleDesc(){
    if(this.isUpdating){
      this.isUpdating = false
    }else{
      this.isUpdating = true
    }
    this.desc = "";
  }
  toggleLink(){
    if(this.isUpdatingLink){
      this.isUpdatingLink = false
    }else{
      this.isUpdatingLink = true
    }
    this.link = "";
  }

  updateDesc(event){
    // this.desc = ((event.target as Element).closest(".descTAsection").querySelector("textarea") as HTMLTextAreaElement).value;
    this.apollo.mutate({
      mutation:gql`
      mutation UpdateChannelDescription ($id : String!, $newDesc: String!){
        updateChannelDescription(user_id: $id, newDesc: $newDesc){
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
      `,variables:{
        id: this.id,
        newDesc: this.desc
      }
    }).subscribe(result => {
      this.toggleDesc()
    },(error) => {
      console.log(error);
    })
  }
  updateLink(event){
    // this.desc = ((event.target as Element).closest(".descTAsection").querySelector("textarea") as HTMLTextAreaElement).value;
    this.apollo.mutate({
      mutation:gql`
      mutation UpdateChannelDescription ($id : String!, $newDesc: String!){
        updateChannelDescription(user_id: $id, newDesc: $newDesc){
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
      `,variables:{
        id: this.id,
        newDesc: this.link
      }
    }).subscribe(result => {
      this.toggleLink()
    },(error) => {
      console.log(error);
    })
  }

  getVideosOfUserId(){
    this.apollo.watchQuery<any>({
      query: gql`
      query GetVideosByUserId($id: String!){
        getVideosByUserId(user_id: $id){
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
      `,variables:{
        id: this.id
      }
    }).valueChanges.subscribe(result => {
      let videos = result.data.getVideosByUserId
      for(let i = 0; i < videos.length; i++){
        this.views = this.views + videos[i].views
      }
      this.stringView = this.formatter(this.views, 1)
    },(error) => {
      console.log(error);
    })
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
