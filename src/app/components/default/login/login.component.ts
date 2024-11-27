import {Component, OnInit} from "@angular/core";
import {CustomValidators} from "../../../utilities/validator/custom-validators";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {take, takeUntil} from "rxjs/operators";
import {User} from "../../../models/account/user";
import {ToastService} from "../../../services/toast.service";
import {HttpClient} from "@angular/common/http";
import {URLS} from "../../../app/app.urls";
import {environment} from "../../../../environments/environment";
import {CreateUserDialogComponent} from "./create-user-dialog/create-user-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Subject} from "rxjs";


@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

    public formGroup: FormGroup;
    public url: string;
    public message: string;
    private readonly urlBase: string;
    private readonly urlLogin: string;
    public storage = localStorage;
    public unsubscribe = new Subject();

    constructor(public formBuilder: FormBuilder,
                public route: ActivatedRoute,
                public toast: ToastService,
                public http: HttpClient,
                private dialog: MatDialog,
                public router: Router) {
        this.urlBase = environment.urlBase;
        this.urlLogin = `${this.urlBase}${URLS.LOGIN}`;
    }

    public ngOnInit() {
        this.createFormGroup();
        this.message = "sign-in";
        this.url = this.route.snapshot.queryParams["u"] || "/";
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            username: [null, CustomValidators.required],
            password: [null, CustomValidators.required],
        });
    }

    public login(): void {
        const user = new User();
        user.username = this.v.username.toString();
        user.password = this.v.password.toString();
        this.message = "processing";
        this.http.post(this.urlLogin, user)
            .pipe(take(1))
            .subscribe({
                next: user => {
                    if (user && user?.["id"]) {
                        this.storage.setItem('user', JSON.stringify(user));
                        window.location.href = '/#/home';
                        window.location.reload();
                    } else {
                        this.toast.error("error-title", "login-error");
                    }
                },
                error: () => {
                    this.f.password.reset();
                }
            });
    }

    public openDialogCreateUSer() {
        const dialogRef = this.dialog.open(CreateUserDialogComponent, {
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

    private get f() {
        return this.formGroup.controls;
    }

    private get v() {
        return this.formGroup.value;
    }
}
