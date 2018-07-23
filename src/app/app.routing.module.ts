import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapPageComponent } from './map-page.component';
import { AboutPageComponent } from './about-page.component';
import { ForumPageComponent } from './forum-page.component';
import { LinksPageComponent } from './links-page.component';

/**
 * Setup all routes here
 */
export const routes: Routes = [
  {
    path: 'map',
    pathMatch: 'full',
    component: MapPageComponent
  },
  {
    path: 'about',
    pathMatch: 'full',
    component: AboutPageComponent
  },
  {
    path: 'forum',
    pathMatch: 'full',
    component: ForumPageComponent
  },
  {
    path: 'links',
    pathMatch: 'full',
    component: LinksPageComponent
  },
  {
    path: '**',
    redirectTo: 'map'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
