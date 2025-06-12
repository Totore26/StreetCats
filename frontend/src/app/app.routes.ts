import { Routes } from '@angular/router';
import { WelcomePage } from './welcome-page/welcome-page';
import { CatSightings } from './homepage/cat-sightings/cat-sightings';
import { CatDetails } from './homepage/cat-details/cat-details';
import { SightingCreation } from './homepage/sighting-creation/sighting-creation';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Profile } from './homepage/profile/profile';

import { authGuard } from './_guards/auth-guard';

export const routes: Routes = [
    { path: '', component: WelcomePage , title: 'StreetCat' },
    { path: 'catSightings', component: CatSightings, title: 'Cat Sightings' },
    { path: 'catDetails/:id', component: CatDetails, title: 'Cat Details' },
    { path: 'login', component: Login, title: 'Login' },
    { path: 'signup', component: Signup, title: 'Sign Up' },
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