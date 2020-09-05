import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {

  plan
  price
  user
  isPremium
  checkedUser

  premDate;
  premExp;
  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.isPremium = false
    this.getLoggedUser()
    this.plan = "monthly"
    this.price = "59,000"
    if(this.user != null){
      this.getUser()

    }
  }

  setPlan(plan){
    this.plan = plan
    if(plan == "monthly"){
      this.price = "59,000"
    }else{
      this.price = "659,000"
    }
  }

  getLoggedUser(){
    this.user = JSON.parse(localStorage.getItem("currentUser"))
  }

  updatePremium(){
    this.getLoggedUser()
    if(!this.user){
      console.log("no user");
      window.alert("Please login")
    }else{
      this.apollo.mutate<any>({
        mutation:gql`
        mutation UpdatePremium($id: String!, $bil:String!){
          updatePremium(id: $id, billing: $bil){
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
        `,variables:{
          id: this.user.id,
          bil: this.plan
        }
      }).subscribe( result => {
        this.isPremium = true
      }),(error) => {
        console.log(error);
      }

    }
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
            like_video
            dislike_video
            like_post
            dislike_post
            premium_type
          }
        }
      `,
      variables:{
        id: this.user.id
      }
    }).valueChanges.subscribe(result => {
      this.checkedUser = result.data.getUser
      if(this.checkedUser.premium_type == "monthly"){
        this.isPremium = true
        this.user = this.checkedUser
        this.setDateRange()
      }else if(this.checkedUser.premium_type == "annually"){
        this.isPremium = true
        this.user = this.checkedUser
        this.setDateRange()
      }else{
        this.isPremium = false
      }
    },(error) => {
      console.log(error);
    })
  }

  setDateRange(){
    let d1 = this.user.premium_date
    console.log(d1);
    let year = d1[0]+d1[1]+d1[2]+d1[3]
    let month = d1[5]+d1[6]
    let date = d1[8]+d1[9]

    let y = parseInt(year)
    let m = parseInt(month)
    let d = parseInt(date)
    console.log(y+" "+m+" "+d);

    var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];

    var selectedMonth = months[m-1];
    this.premDate = d+" "+selectedMonth+" "+y+" ("+this.user.premium_type+")"
    console.log(this.premDate);
    if(this.user.premium_type == "monthly"){
      for(let i = 0; i < 1; i++){
        m = m + 1
        if(m > 12){
          m = 1
          y = y + 1
        }
      }
    }else if(this.user.premium_type == "annually"){
      y = y + 1
    }
    selectedMonth = months[m-1];
    this.premExp = d+" "+selectedMonth+" "+y;
    console.log(this.premExp);
    
  }

}
