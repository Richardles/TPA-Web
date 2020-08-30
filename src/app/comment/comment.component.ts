import { Component, OnInit, Query, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
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
  
  @Input() comment;
  replies
  user;
  loggedUser;
  isReply;
  rep;
  isLiked;

  constructor(private apollo: Apollo) { }

  
  ngOnInit(): void {
    this.getUserById()
    this.loggedUser = this.getLoggedUser()
    this.isReply = false;
    this.isLiked = false;
    this.checkIsLike(this.loggedUser)
    this.GetReplies()
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
          }
        }
      `,
      variables:{
        id: this.comment.user_id
      }
    }).valueChanges.subscribe(result => {
      console.log(result);
      this.user = result.data.getUser
    },(error) => {
      console.log(error);
    })
  }

  getLoggedUser(){
    let user = JSON.parse(localStorage.getItem("currentUser"))
    return user
  }

  submitReply(){
      this.apollo.mutate({
        mutation: gql`
          mutation CreateComment($comment: String!, $userId: String!, $replyId: Int, $vidId: Int){
            createComment(input:{
              comment: $comment,
              user_id: $userId,
              likes: 0,
              dislikes: 0,
              replies_id: $replyId,
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
          comment: this.rep,
          userId: this.loggedUser.id,
          replyId: this.comment.id,
          vidId: this.comment.video_id
        },
        refetchQueries:[{
          query: this.GET_COMMENTS
        }]
      }).subscribe( data  => {
        
      },(error) => {
        console.log('there was an error sending the query', error);
      })
  }

  checkIsLike(user){
    let likes = user.like_comment
    if(likes.includes(this.comment.id.toString())){
      this.isLiked = true
    }else{
      this.isLiked = false
    }
  }

  reply(){
    if(this.isReply){
      this.isReply = false
    }else{
      this.isReply = true
    }
  }

  updateLike(){
    this.apollo.mutate<any>({
      mutation:gql`
      mutation UpdateLikeComment($uid: String!, $cid: Int!){
        updateLikeCommentInUser(user_id: $uid, comment_id: $cid){
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
        }
      }
      `,variables:{
        uid: this.loggedUser.id,
        cid: this.comment.id
      },
      refetchQueries:[{
        query: this.GET_COMMENTS
      }]
    }).subscribe( result => {
      let user = result.data.updateLikeCommentInUser
      // this.checkIsLike(user)
    }),(error) => {
      console.log(error);
    }
  }

  updateDislike(){
    this.apollo.mutate<any>({
      mutation:gql`
      mutation UpdateDislikeComment($uid: String!, $cid: Int!){
        updateDislikeCommentInUser(user_id: $uid, comment_id: $cid){
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
        }
      }
      `,variables:{
        uid: this.loggedUser.id,
        cid: this.comment.id
      },
      refetchQueries:[{
        query: this.GET_COMMENTS
      }]
    }).subscribe( result => {
      let user = result.data.updateDislikeCommentInUser
    }),(error) => {
      console.log(error);
    }
  }

  GetReplies(){
    this.apollo.watchQuery<any>({
      query:gql`
      query GetReplies($cid: Int!){
        getRepliesByCommentId(comment_id: $cid){
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
        cid: this.comment.id
      }
    }).valueChanges.subscribe( result => {
      this.replies = result.data.getRepliesByCommentId
    }),(error) => {
      console.log(error);
    }
  }

}
