import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TrendingComponent } from './trending/trending.component';
import { SubscriptionComponent } from './subscription/subscription.component';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
} from 'angularx-social-login';
import { HeaderComponent } from './header/header.component';
import { UploadComponent } from './upload/upload.component';
import { UploadChildComponent } from './upload-child/upload-child.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { DirectiveDropDirective } from './directive-drop.directive';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { VideoBoxComponent } from './video-box/video-box.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { RelatedVideoComponent } from './related-video/related-video.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { CommentComponent } from './comment/comment.component';
import { CommentRepliesComponent } from './comment-replies/comment-replies.component';
import { ChannelComponent } from './channel/channel.component';
import { ChannelHomeComponent } from './channel/channel-home/channel-home.component';
import { ChannelVideosComponent } from './channel/channel-videos/channel-videos.component';
import { ChannelPlaylistsComponent } from './channel/channel-playlists/channel-playlists.component';
import { ChannelCommunityComponent } from './channel/channel-community/channel-community.component';
import { ChannelAboutComponent } from './channel/channel-about/channel-about.component';
import { PlaylistModalComponent } from './playlist-modal/playlist-modal.component';
import { PlaylistPageComponent } from './playlist-page/playlist-page.component';
import { PlaylistVideosComponent } from './playlist-page/playlist-videos/playlist-videos.component';
import { CommunityPostsComponent } from './community-posts/community-posts.component';

const fireConfig = {
    apiKey: "AIzaSyA2VWuhvm5N68oILOWtoYgPq_nTCbvvfEY",
    authDomain: "my-project-8ee8b.firebaseapp.com",
    databaseURL: "https://my-project-8ee8b.firebaseio.com",
    projectId: "my-project-8ee8b",
    storageBucket: "my-project-8ee8b.appspot.com",
    messagingSenderId: "296899613022"
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TrendingComponent,
    SubscriptionComponent,
    HeaderComponent,
    UploadComponent,
    UploadChildComponent,
    DirectiveDropDirective,
    VideoBoxComponent,
    VideoPlayerComponent,
    RelatedVideoComponent,
    SearchPageComponent,
    PlaylistComponent,
    CommentComponent,
    CommentRepliesComponent,
    ChannelComponent,
    ChannelHomeComponent,
    ChannelVideosComponent,
    ChannelPlaylistsComponent,
    ChannelCommunityComponent,
    ChannelAboutComponent,
    PlaylistModalComponent,
    PlaylistPageComponent,
    PlaylistVideosComponent,
    CommunityPostsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    AngularFireModule.initializeApp(fireConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    GraphQLModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '923946978263-fs7jsg0jaa7gob0hogfkpumvkq9iqjg6.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
