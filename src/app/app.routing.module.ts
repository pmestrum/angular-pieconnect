import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapPageComponent } from './components/map-page.component';
import { AboutPageComponent } from './components/about-page.component';
import { ForumPageComponent } from './components/forum-page.component';
import { LinksPageComponent } from './components/links-page.component';
import { DocPageComponent } from './components/doc-page.component';

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
    path: 'doc',
    pathMatch: 'full',
    component: DocPageComponent
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
