import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { CreateBlog } from './components/create-blog/create-blog';
import { UpdateBlog } from './components/update-blog/update-blog';
import { ViewBlog } from './components/view-blog/view-blog';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path:'home',
        component:Home
    },
    {
        path:'register',
        component:Register
    },
    {
        path:'login',
        component:Login
    },
    {
        path:'create-blog',
        component:CreateBlog
    },
    {
        path:'update-blog',
        component:UpdateBlog
    },
    {
        path:'view-blog',
        component:ViewBlog
    }

];
