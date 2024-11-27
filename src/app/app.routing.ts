import {Routes} from "@angular/router";
import {LoginComponent} from "./components/default/login/login.component";
import {HomeComponent} from "./components/default/home/home.component";
import {MainComponent} from "./components/default/main/main.component";

export const ROUTES: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {
        path: "",
        component: MainComponent,
        children: [
            {
                path: "",
                redirectTo: "home",
                pathMatch: "full"
            },
            {
                path: "home",
                component: HomeComponent
            },
        ]
    }
];
