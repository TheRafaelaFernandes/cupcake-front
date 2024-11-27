import {NgModule} from "@angular/core";
import {CommonModule, NgOptimizedImage} from "@angular/common";

import {MenuComponent} from "./menu/menu.component";
import {MatBadgeModule} from "@angular/material/badge";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatRippleModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterModule} from "@angular/router";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MainComponent} from "./main.component";
import {MainService} from "./main.service";
import {SharedModule} from "../../../shared.module";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {NgxMaskDirective} from "ngx-mask";

@NgModule({
    imports: [
        CommonModule,
        ScrollingModule,
        SharedModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatRippleModule,
        MatMenuModule,
        MatCardModule,
        MatTooltipModule,
        MatToolbarModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatBadgeModule,
        NgOptimizedImage,
        NgxMaskDirective
    ],
    declarations: [
        MainComponent,
        MenuComponent,
    ],
    providers: [
        MainService,
    ]
})
export class MainModule {
}
