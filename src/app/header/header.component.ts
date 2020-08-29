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

  constructor(private authService: SocialAuthService, private apollo: Apollo, private router: Router) { }

  auto = [];
  videos = [];
  
  ngOnInit(): void {
    if(localStorage.getItem("currentUser") != null){
      this.loggedUser = JSON.parse(localStorage.getItem("currentUser"))
      console.log(this.loggedUser);
    }
    (<HTMLElement>document.querySelector(".side-bar-list")).style.left = "-230px";
    this.getVideo();
    this.search = "";
    this.userMenus = false;
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

  displayAutoComplete(event){
    this.auto = [];
    this.videos.forEach(element => {
      if(element.title.toString().toLowerCase().includes(this.search.toLowerCase())){
        this.auto.push(element.title);
      }
    })
    console.log(this.auto);
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
        id: this.user.id
      }
    }).valueChanges.subscribe(result => {
      console.log("this is the result"+result);
      //udah ada
      this.loggedUser = result.data.getUser;
      localStorage.removeItem("currentUser");
      localStorage.setItem("currentUser",JSON.stringify(this.loggedUser));
      // location.reload();
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
          channel_art: $c_art
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
