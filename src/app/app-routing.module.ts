import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrendingComponent } from './trending/trending.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { HeaderComponent } from './header/header.component';
import { UploadComponent } from './upload/upload.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { ChannelComponent } from './channel/channel.component';
import { ChannelHomeComponent } from './channel/channel-home/channel-home.component';
import { ChannelVideosComponent } from './channel/channel-videos/channel-videos.component';
import { ChannelPlaylistsComponent } from './channel/channel-playlists/channel-playlists.component';
import { ChannelCommunityComponent } from './channel/channel-community/channel-community.component';
import { ChannelAboutComponent } from './channel/channel-about/channel-about.component';
import { PlaylistModalComponent } from './playlist-modal/playlist-modal.component';
import { PlaylistPageComponent } from './playlist-page/playlist-page.component';
import { TrendingVideosComponent } from './trending/trending-videos/trending-videos.component';
import { PremiumComponent } from './premium/premium.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { RefreshComponent } from './refresh/refresh.component';
import { CategoryPageComponent } from './category-page/category-page.component';
import { QueueBoxComponent } from './queue-box/queue-box.component';


const routes: Routes = [
  {path:"", redirectTo:"/home", pathMatch: 'full'},
  {path:"upload", component: UploadComponent},
  {path:"home", component: HomeComponent},
  {path:"trending-page", component: TrendingComponent},
  {path:"subscription-page", component: SubscriptionComponent},
  {path:"category-page/:category", component: CategoryPageComponent},
  {path:"playlist-modal", component: PlaylistModalComponent},
  {path:"trending-videos", component: TrendingVideosComponent},
  {path:"premium", component: PremiumComponent},
  {path:"refresh", component: RefreshComponent},
  {path:"search-page/:query", component: SearchPageComponent},
  {path:"playlist-page/:id", component: PlaylistPageComponent},
  {path:"video-player-page/:id", component: VideoPlayerComponent},
  {path:"channel-app/:id", component: ChannelComponent,
  children:[{path: 'home', component: ChannelHomeComponent},
            {path: 'videos', component: ChannelVideosComponent},
            {path: 'playlists', component: ChannelPlaylistsComponent},
            {path: 'community', component: ChannelCommunityComponent},
            {path: 'about', component: ChannelAboutComponent},]}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
