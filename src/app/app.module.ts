import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from "@angular/common";
import localePt from "@angular/common/locales/pt";
import {ROUTES} from "./app.routing";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {NoPreloading, RouterModule} from "@angular/router";
import {SharedModule} from "./shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconRegistry} from "@angular/material/icon";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastService} from "./services/toast.service";
import {AppComponent} from "./app/app.component";
import {LoginComponent} from "./components/default/login/login.component";
import {MainModule} from "./components/default/main/main.module";
import {AppVariables} from "./app/app.variables";
import {ToastrModule} from "ngx-toastr";
import {NgProgressbar} from "ngx-progressbar";
import {NgProgressHttp} from "ngx-progressbar/http";
import {IConfig, NgxMaskDirective, provideEnvironmentNgxMask} from "ngx-mask";
import {register} from "swiper/element/bundle";
import {HomeComponent} from "./components/default/home/home.component";
import {CreateUserDialogComponent} from "./components/default/login/create-user-dialog/create-user-dialog.component";
import {SeeOrderDialogComponent} from "./components/default/main/menu/see-order-dialog/see-order-dialog.component";
import {AddCupcakeDialogComponent} from "./components/default/main/menu/add-cupcake-dialog/add-cupcake-dialog.component";
import {MyOrdersDialogComponent} from "./components/default/main/menu/my-orders-dialog/my-orders-dialog.component";
import {MyFavoritesDialogComponent} from "./components/default/main/menu/my-favorites-dialog/my-favorites-dialog.component";
import {TOAST_OPTIONS} from "./app/app.constant";
import {AuthInterceptor} from "./utilities/auth.interceptor";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {EditCustomerDialogComponent} from "./components/default/main/menu/edit-customer-dialog/edit-customer-dialog.component";

register();

registerLocaleData(localePt, "pt");

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        CreateUserDialogComponent,
        SeeOrderDialogComponent,
        AddCupcakeDialogComponent,
        MyOrdersDialogComponent,
        MyFavoritesDialogComponent,
        EditCustomerDialogComponent
    ],
    imports: [
        BrowserModule,
        MatDialogModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgProgressbar,
        NgProgressHttp,
        MainModule,
        ToastrModule.forRoot(TOAST_OPTIONS),
        SharedModule.forRoot(),
        RouterModule.forRoot(ROUTES, {preloadingStrategy: NoPreloading}),
        NgxMaskDirective
    ],
    providers: [
        AppVariables,
        ToastService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {appearance: "outline"}
        },
        provideEnvironmentNgxMask(maskConfig),
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(public matIconRegistry: MatIconRegistry) {

        this.matIconRegistry.registerFontClassAlias("fas", "fas");
    }
}
