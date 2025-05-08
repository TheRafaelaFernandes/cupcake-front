import {Component, Inject, Injector, OnInit} from "@angular/core";
import {BaseComponent} from "../../../../base.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {URLS} from "../../../../../app/app.urls";
import {environment} from "../../../../../../environments/environment";
import {AuthService} from "../../../../../services/auth.service";
import {Customer} from "../../../../../models/account/customer";


@Component({
    selector: "app-my-orders-dialog",
    templateUrl: "./my-orders-dialog.component.html",
    styleUrls: ["./my-orders-dialog.component.scss"]
})
export class MyOrdersDialogComponent extends BaseComponent<Customer> implements OnInit {

    public object: Customer = new Customer();
    private readonly urlBase: string;
    private readonly urlCupcakeOrder: string;
    public orders: any[] = [];

    constructor(public dialogRef: MatDialogRef<MyOrdersDialogComponent>,
                public injector: Injector,
                public authService: AuthService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(injector, {endpoint: URLS.CUSTOMER});
        this.urlBase = environment.urlBase;
        this.urlCupcakeOrder = `${this.urlBase}${URLS.CUPCAKE_ORDER}`;
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
        this.http.get( `${this.urlCupcakeOrder}?customer_id=${this.authService.user?.['id']}`).subscribe({
            next: (response: any) => {
                this.orders = response;
            },
            error: (error) => {
                console.error('Erro ao carregar pedidos:', error);
            }
        });
    }

}
