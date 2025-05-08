import {Component, Inject, Injector, OnInit} from "@angular/core";
import {BaseComponent} from "../../../../base.component";
import {Customer} from "../../../../../models/account/customer";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {URLS} from "../../../../../app/app.urls";
import {environment} from "../../../../../../environments/environment";
import {AuthService} from "../../../../../services/auth.service";


@Component({
    selector: "app-my-orders-dialog",
    templateUrl: "./my-favorites-dialog.component.html",
    styleUrls: ["./my-favorites-dialog.component.scss"]
})
export class MyFavoritesDialogComponent extends BaseComponent<Customer> implements OnInit {

    public object: Customer = new Customer();
    private readonly urlBase: string;
    private readonly urlFavoriteCupcake: string;
    public cupcakes: any[] = [];

    constructor(public dialogRef: MatDialogRef<MyFavoritesDialogComponent>,
                public injector: Injector,
                public authService: AuthService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(injector, {endpoint: URLS.CUSTOMER});
        this.urlBase = environment.urlBase;
        this.urlFavoriteCupcake = `${this.urlBase}${URLS.FAVORITE_CUPCAKE}`;
    }

    public ngOnInit(): void {
        super.ngOnInit(() => {
            this.getOrders();
        });
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
        });
    }

    public close(): void {
        this.dialogRef.close();
    }

    public getOrders(): void {
        this.http.get( `${this.urlFavoriteCupcake}?customer_id=${this.authService.user?.['id']}`).subscribe({
            next: (response: any) => {
                this.cupcakes = response;
            },
            error: (error) => {
                console.error('Erro ao carregar pedidos:', error);
            }
        });
    }

}
