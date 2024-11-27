import {Component, Input, OnInit} from "@angular/core";
import {takeUntil} from "rxjs/operators";
import {Router} from "@angular/router";
import {ToastService} from "../../../../services/toast.service";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {environment} from "../../../../../environments/environment";
import {URLS} from "../../../../app/app.urls";
import {Subject} from "rxjs";
import {SeeOrderDialogComponent} from "./see-order-dialog/see-order-dialog.component";
import {AuthService} from "../../../../services/auth.service";
import {AddCupcakeDialogComponent} from "./add-cupcake-dialog/add-cupcake-dialog.component";
import {MyOrdersDialogComponent} from "./my-orders-dialog/my-orders-dialog.component";
import {MyFavoritesDialogComponent} from "./my-favorites-dialog/my-favorites-dialog.component";

@Component({
    selector: "app-menu",
    templateUrl: "./menu.component.html",
    styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {

    @Input() showLabel = true;
    private readonly urlBase: string;
    private readonly urlLogin: string;
    public user: string;
    public unsubscribe = new Subject();

    constructor(public authService: AuthService,
                public toast: ToastService,
                public http: HttpClient,
                private dialog: MatDialog,
                public router: Router) {
        this.urlBase = environment.urlBase;
        this.urlLogin = `${this.urlBase}${URLS.LOGIN}`;
    }

    public ngOnInit() {
        this.user = this.authService.user;
    }

    public openDialogSeeOrder() {
        const dialogRef = this.dialog.open(SeeOrderDialogComponent, {
                width: "45%",
                height: "autoHeight",
                disableClose: true
            }
        );
        dialogRef.afterClosed()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(response => {
                console.log(response)
            });
    }

    public openDialogMyFavorites() {
        const dialogRef = this.dialog.open(MyFavoritesDialogComponent, {
                width: "45%",
                height: "autoHeight",
                disableClose: true
            }
        );
        dialogRef.afterClosed()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(response => {
                console.log(response)
            });
    }

    public openDialogAddCupcake() {
        const dialogRef = this.dialog.open(AddCupcakeDialogComponent, {
                width: "45%",
                height: "autoHeight",
                disableClose: true
            }
        );
        dialogRef.afterClosed()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(response => {
                console.log(response)
            });
    }

    public openDialogMyOrders() {
        const dialogRef = this.dialog.open(MyOrdersDialogComponent, {
                width: "45%",
                height: "autoHeight",
                disableClose: true
            }
        );
        dialogRef.afterClosed()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(response => {
                console.log(response)
            });
    }

}
