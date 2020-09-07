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
// import { TrendingVideosComponent } from './trending/trending-videos/trending-videos.component';
import { ChannelBoxComponent } from './channel-box/channel-box.component';
import { PlaylistBoxComponent } from './playlist-box/playlist-box.component';
import { TrendingVideoBoxComponent } from './trending-video-box/trending-video-box.component';
import { RefreshComponent } from './refresh/refresh.component';
import { PremiumComponent } from './premium/premium.component';
import { NotifBoxComponent } from './notif-box/notif-box.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { PlaylistBoxSearchComponent } from './playlist-box-search/playlist-box-search.component';
import { CategoryPageComponent } from './category-page/category-page.component';
import { QueueBoxComponent } from './queue-box/queue-box.component';

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
    CommunityPostsComponent,
    // TrendingVideosComponent,
    ChannelBoxComponent,
    PlaylistBoxComponent,
    TrendingVideoBoxComponent,
    RefreshComponent,
    PremiumComponent,
    NotifBoxComponent,
    DateAgoPipe,
    PlaylistBoxSearchComponent,
    CategoryPageComponent,
    QueueBoxComponent,
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
              '1010191127145-doanmfkr3t7kfpd75bjtt9tbktu1dna5.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
