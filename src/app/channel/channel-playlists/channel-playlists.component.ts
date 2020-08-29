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

  constructor(private apollo:Apollo, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.parent.snapshot.paramMap.get('id');
    this.getPlayListByUser()
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
    },(error) => {
      console.log('there was an error sending the query', error);
    })
  }

}
