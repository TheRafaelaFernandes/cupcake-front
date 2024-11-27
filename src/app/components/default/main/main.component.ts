import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../../../services/auth.service";
import {MainService} from "./main.service";
import {SIDENAV_CONTENT_EXPANDED, SIDENAV_EXPANDED} from "./menu/menu.animation";
import {distinctUntilChanged, takeUntil} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Location} from "@angular/common";
import {Subject} from "rxjs";
import {Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";


@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
    animations: [SIDENAV_EXPANDED, SIDENAV_CONTENT_EXPANDED],
})
export class MainComponent implements OnInit, OnDestroy {

    private unsubscribe = new Subject();

    public isExpanded = true;
    public title: string;
    public user: string;

    constructor(public titleService: Title,
                public authService: AuthService,
                public mainService: MainService,
                public snackBar: MatSnackBar,
                public router: Router,
                public location: Location,
                public http: HttpClient
    ) {
        this.onChangeTitle();
        this.onChangeSnackBar();
    }

    public ngOnInit() {
        if (!this.authService.user) {
            this.logout();
            return;
        }

        this.user = this.authService.user;
        this.isExpanded = window.screen.width > 1024;
    }

    public ngOnDestroy() {
        this.unsubscribe.next({});
        this.unsubscribe.complete();
    }

    public onChangeTitle(): void {

        this.mainService.changeTitle.pipe(
            takeUntil(this.unsubscribe),
            distinctUntilChanged()
        ).subscribe(nextTitle => {
            this.title = nextTitle;
            this.titleService.setTitle(this.title);
        });
    }

    public onChangeSnackBar(): void {
        this.mainService.changeSnackBar.pipe(
            takeUntil(this.unsubscribe),
            distinctUntilChanged()
        ).subscribe(message => this.showSnackBar(message));
    }

    public showSnackBar(message: string) {
        this.snackBar.open(message, null, {
            duration: 5000,
            panelClass: "snack-bar"
        });
    }

    public onResize(event): void {
        const windowWidth = event.target.innerWidth;
        this.isExpanded = windowWidth > 1024;
    }

    public logout(): void {
        this.authService.logout();
    }

}
