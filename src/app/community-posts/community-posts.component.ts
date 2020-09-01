import { Component, OnInit, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-community-posts',
  templateUrl: './community-posts.component.html',
  styleUrls: ['./community-posts.component.scss']
})
export class CommunityPostsComponent implements OnInit {

  @Input() post
  @Input() id
  user

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.getUser()
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
        id: this.id
      }
    }).valueChanges.subscribe(result => {
      this.user = result.data.getUser
    },(error) => {
      console.log(error);
    })
  }

  updateLike(){
    this.apollo.mutate({
      mutation:gql`
      mutation LikePost($uid: String!, $pid: Int!){
        updateLikePost(user_id: $uid, post_id: $pid){
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
        uid: this.user.id,
        pid: this.post.id
      }
    }).subscribe( result => {

    }),(error)=>{
      console.log(error);
    }
  }

  updateDislike(){
    this.apollo.mutate({
      mutation:gql`
      mutation DislikePost($uid: String!, $pid: Int!){
        updateDislikePost(user_id: $uid, post_id: $pid){
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
        uid: this.user.id,
        pid: this.post.id
      }
    }).subscribe( result => {

    }),(error)=>{
      console.log(error);
    }
  }

  updateDislikeThenLike(){
    this.apollo.mutate({
      mutation:gql`
      mutation DislikePost($uid: String!, $pid: Int!){
        updateDislikePost(user_id: $uid, post_id: $pid){
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
        uid: this.user.id,
        pid: this.post.id
      }
    }).subscribe( result => {

      console.log("dislike -> like");
      this.updateLike()
    }),(error)=>{
      console.log(error);
    }
  }

  updateLikeThenDislike(){
    this.apollo.mutate({
      mutation:gql`
      mutation LikePost($uid: String!, $pid: Int!){
        updateLikePost(user_id: $uid, post_id: $pid){
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
        uid: this.user.id,
        pid: this.post.id
      }
    }).subscribe( result => {
      console.log("like -> dislike");
      
      this.updateDislike()
    }),(error)=>{
      console.log(error);
    }
  }

  dislike(){
    this.getUser()
    let l = this.user.like_post
    if(l.includes(this.post.id.toString())){
      this.updateLikeThenDislike()
      
      console.log("like -> dislike");
    }else{
      this.updateDislike()
    }
  }
  like(){
    this.getUser()
    let l = this.user.dislike_post
    if(l.includes(this.post.id.toString())){
      this.updateDislikeThenLike()
      
      console.log("dislike -> like");
    }else{
      this.updateLike() 
    }
  }

}
