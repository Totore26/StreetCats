import { Routes } from '@angular/router';
import { WelcomePage } from './welcome-page/welcome-page';
import { CatMap } from './homepage/cat-map/cat-map';
import { CatList } from './homepage/cat-list/cat-list';
import { CatDetails } from './homepage/cat-details/cat-details/cat-details';
import { Comment } from './homepage/cat-details/comment/comment';
import { SightingCreation } from './homepage/sighting-creation/sighting-creation';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Profile } from './homepage/profile/profile';

import { authGuard } from './_guards/auth-guard';

export const routes: Routes = [
    { path: '', component: WelcomePage , title: 'StreetCat' },
    { path: 'catMap', component: CatMap, title: 'Cat Map' },
    { path: 'catList', component: CatList, title: 'Cat List' },
    { path: 'catDetails/:id', component: CatDetails, title: 'Cat Details' },
    { path: 'login', component: Login, title: 'Login' },
    { path: 'signup', component: Signup, title: 'Sign Up' },
    { path: 'catDetails/:id/comment',component: Comment, title: 'Comment' },
    { 
        path: 'sightingCreation', 
        component: SightingCreation, 
        title: 'Sighting Creation', 
        canActivate: [authGuard] 
    },
    { 
        path: 'profile', 
        component: Profile, 
        title: 'Profile', 
        canActivate: [authGuard] 
    },
    { path: '**', redirectTo: '', pathMatch: 'full' } // percorso non trovato -> homepage
];