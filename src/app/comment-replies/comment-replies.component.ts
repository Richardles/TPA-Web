import { Component, OnInit, Input } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.component.html',
  styleUrls: ['./comment-replies.component.scss']
})
export class CommentRepliesComponent implements OnInit {
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
  loggedUser;
  isReply;
  rep;
  isLiked;
  user;

  constructor(private apollo:Apollo) { }

  ngOnInit(): void {
    this.loggedUser = this.getLoggedUser()
    this.isReply = false
    this.getUserById()
  }

  getLoggedUser(){
    let user = JSON.parse(localStorage.getItem("currentUser"))
    return user
  }

  reply(){
    if(this.isReply){
      this.isReply = false
    }else{
      this.isReply = true
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
        replyId: this.comment.replies_id,
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

}
