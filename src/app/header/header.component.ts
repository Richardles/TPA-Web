import { Component, OnInit } from '@angular/core';
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { SocialAuthService } from "angularx-social-login";
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { element } from 'protractor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isOpen = false;
  userMenus;
  user: SocialUser;
  loggedUser: any;
  userss: any;
  search: string;
  isSearching;
  isShortKey;
  setting;
  logged;
  isNotifOpen
  subscription = [];
  tempUser;
  
  constructor(private authService: SocialAuthService, private apollo: Apollo, private router: Router) { }
  
  sideBarSubs = [];
  auto = [];
  videos = [];
  notifs = [];
  notifToShow = [];
  
  ngOnInit(): void {
    if(localStorage.getItem("currentUser") != null){
      this.loggedUser = JSON.parse(localStorage.getItem("currentUser"))
      console.log(this.loggedUser);
    }
    (<HTMLElement>document.querySelector(".side-bar-list")).style.left = "-230px";
    this.getVideo();
    this.search = "";
    this.isSearching = false
    this.userMenus = false;
    this.isShortKey = false;
    this.setting = false;
    this.logged = false;
    this.getLoggedUser();
    this.isNotifOpen = false
    this.getUserNotifyId()
  }

  signIn(): void {
    
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    
    this.authService.authState.subscribe((user) => {
      this.userss = user;
      console.log(this.userss);
      localStorage.setItem("currentUser",JSON.stringify(user));
      this.user = JSON.parse(localStorage.getItem("currentUser"))
      console.log(this.user)
      this.getUser();
    })
  }

  signOut(): void {
    localStorage.removeItem("currentUser");
    this.authService.signOut();
    location.reload()
  }

  getLoggedUser(){
    let user = JSON.parse(localStorage.getItem("currentUser"))
    this.getUpdatedUser(user.id)
    if(user){
      this.logged = true
    }else{
      this.logged = false
    }
  }

  searchVid(){
    document.getElementById("search_bar").nodeValue = ""
    this.router.navigateByUrl("/refresh", {skipLocationChange: true}).then(()=>{
      this.router.navigateByUrl("/search-page/" + this.search)
    })
    this.isSearching = false
  }

  switchAcc(){
    // this.signOut()
    // this.signIn()
  }

  toggleNotif(){
    if(this.isNotifOpen){
      this.isNotifOpen = false
    }else{
      this.isNotifOpen = true
    }
  }

  getUserNotifyId(){
    let n = this.loggedUser.notified_by.split(',')
    this.getNotif(n.toString())
    console.log(n.toString());
  }
  
  getNotif(id){
    this.apollo.watchQuery<any>({
      query:gql`
      query GetActivities($uid: String!){
        getActivitiesByUserId(user_id: $uid){
          id
          user_id
          video_id
          post_id
        }
      }
      `,variables:{
        uid: id
      }
    }).valueChanges.subscribe( result => {
      this.notifs = result.data.getActivitiesByUserId
    }),(error) => {
      console.log(error);
      console.log(id);
    }
  }

  toggleSidebar(){
    let side = (<HTMLElement>document.querySelector(".side-bar-list")).style;
    let grayScreen = (<HTMLElement>document.querySelector(".gray-screen")).style;

    if(side.left == "-230px"){
      side.left = "0px"
      grayScreen.display = "block"
    }else{
      side.left = "-230px"
      grayScreen.display = "none"
    }
  }

  up(){
    console.log(this.search);
    if(this.search !== ""){
      this.isSearching = true
    }else{
      this.isSearching = false
    }
  }

  displayAutoComplete(event){
    this.auto = [];
    this.videos.forEach(element => {
      if(element.title.toString().toLowerCase().includes(this.search.toLowerCase())){
        this.auto.push(element.title);
      }
    })
    console.log(this.auto);
    this.up()
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
        }
      }
      `,
    }).valueChanges.subscribe(result => {
      this.videos = result.data.videos
    },(error) => {
      console.log(error);
    })
  }

  toggleKey(){
    if(this.isShortKey){
      this.isShortKey = false
    }else{
      this.isShortKey = true
      this.setting = false
    }
  }
  toggleSetting(){
    if(this.setting){
      this.setting = false
    }else{
      this.setting = true
    }
  }

  getSubscription(){
    this.subscription = this.loggedUser.subscribed.split(',')
    console.log(this.subscription);
    
    for(let i = 0; i < this.subscription.length; i++){
      this.getSubs(this.subscription[i])
    }
  }

  getSubs(uid){
    console.log(uid);
    
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
        id: uid
      }
    }).valueChanges.subscribe(result => {
      this.tempUser = result.data.getUser
      this.sideBarSubs.push(this.tempUser)
    },(error) => {
      console.log(error);
    })
  }

  getUpdatedUser(uid){
    
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
        id: uid
      }
    }).valueChanges.subscribe(result => {
      this.loggedUser = result.data.getUser;
      this.getSubscription()
      
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
        id: this.user.id
      }
    }).valueChanges.subscribe(result => {
      console.log("this is the result"+result);
      //udah ada
      this.loggedUser = result.data.getUser;
      localStorage.removeItem("currentUser");
      localStorage.setItem("currentUser",JSON.stringify(this.loggedUser));
      this.getSubscription()
      
    },(error) => {
      console.log(error);
      //ga ada -> create
      this.createUser()
    })
  }

  createUser(){
    this.apollo.mutate({
      mutation: gql`
      mutation CreateUser($id: String!, $name: String!, $pp: String!, $email: String!, $location: String!, 
        $premium: Boolean!, $restric: Boolean!, $c_icon: String!, $c_desc: String!, $c_art: String!){
        createUser(input: {
          id: $id,
          name: $name,
          profile_picture: $pp,
          subscriber: 0
          email: $email,
          location: $location,
          premium: $premium,
          restriction: $restric,
          channel_icon: $c_icon,
          channel_description: $c_desc,
          channel_join_date: "",
          channel_views: 0,
          channel_location: "Indonesia",
          channel_art: $c_art,
          like_comment: 0,
          dislike_comment: 0,
          subscribed: ""
        }){
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
          like_comment
          like_comment
          dislike_comment
          subscribed
        }
      }
      `,variables:{
        id: this.user.id,
        name: this.user.name,
        pp: this.user.photoUrl,
        email: this.user.email,
        location: "Indonesia",
        premium: false,
        restric: false,
        c_icon: this.user.photoUrl,
        c_desc: "",
        c_art: ""
      }
    }).subscribe(result => {
      this.loggedUser = result.data
      this.loggedUser = this.loggedUser.createUser
      localStorage.removeItem("currentUser");
      localStorage.setItem("currentUser",JSON.stringify(this.loggedUser));
      console.log(this.loggedUser)
    },(error) => {
      console.log(error);
    })
  }

  toChannel(){
    this.router.navigateByUrl("/channel-app/" + this.loggedUser.id + "/home")
    this.toggleMenu()
  }

  toggleMenu(){
    if(this.userMenus){
      this.userMenus = false
    }else if(this.userMenus == false){
      this.userMenus = true
    }
    console.log(this.userMenus);
  }

}
