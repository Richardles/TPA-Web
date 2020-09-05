import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channel-playlists',
  templateUrl: './channel-playlists.component.html',
  styleUrls: ['./channel-playlists.component.scss']
})
export class ChannelPlaylistsComponent implements OnInit {

  playlists;
  id;
  publicPlaylists = [];
  loggedUser;

  constructor(private apollo:Apollo, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.parent.snapshot.paramMap.get('id');
    this.loggedUser = this.getLoggedUser()
    this.getPlayListByUser()
  }

  getLoggedUser(){
    let user = JSON.parse(localStorage.getItem("currentUser"))
    return user
  }

  getPlayListByUser(){
    this.apollo.watchQuery<any>({
      query: gql`
      query GetPlaylistByUser($id: String!){
        getPlaylistByUser(id: $id){
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
    }).valueChanges.subscribe(({ data }) => {
        this.playlists = data.getPlaylistByUser
        if(this.loggedUser != null){
          if(this.id != this.loggedUser.id){
            this.getPublicPlaylist()
          }
        }else{
          this.getPublicPlaylist()
        }
    },(error) => {
      console.log('there was an error sending the query', error);
    })
  }

  getPublicPlaylist(){
    console.log(this.playlists);
    for(let i = 0; i < this.playlists.length; i++){
      if(this.playlists[i].view_type == "Public"){
        this.publicPlaylists.push(this.playlists[i])
      }
    }
    console.log(this.publicPlaylists);
    this.playlists = this.publicPlaylists
  }

}
