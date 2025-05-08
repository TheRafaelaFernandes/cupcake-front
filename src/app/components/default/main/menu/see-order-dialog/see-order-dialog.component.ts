import {Component, Inject, Injector, OnInit} from "@angular/core";
import {BaseComponent} from "../../../../base.component";
import {Customer} from "../../../../../models/account/customer";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {URLS} from "../../../../../app/app.urls";
import {environment} from "../../../../../../environments/environment";
import {AuthService} from "../../../../../services/auth.service";


@Component({
    selector: "app-see-order-dialog",
    templateUrl: "./see-order-dialog.component.html",
    styleUrls: ["./see-order-dialog.component.scss"]
})
export class SeeOrderDialogComponent extends BaseComponent<Customer> implements OnInit {

    public object: Customer = new Customer();
    public cartItems: any[] = [];
    private readonly urlBase: string;
    private readonly urlOrder: string;

    constructor(public dialogRef: MatDialogRef<SeeOrderDialogComponent>, public injector: Injector, public authService: AuthService, @Inject(MAT_DIALOG_DATA) public data: any) {
        super(injector, {endpoint: URLS.CUSTOMER});
        this.urlBase = environment.urlBase;
        this.urlOrder = `${this.urlBase}${URLS.ORDER}`;
    }

    public ngOnInit(): void {
        super.ngOnInit(() => {
            this.getCart();
        });
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
        });
    }

    public getCart() {
        const items = localStorage.getItem('cart');
        const parsedItems = items ? JSON.parse(items) : [];

        this.cartItems = parsedItems.reduce((acc: any, item: any) => {
            const existingItem = acc.find((i: any) => i.id === item.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                acc.push({...item, quantity: 1});
            }
            return acc;
        }, []);
    }

    public getTotalPrice(): number {
        return this.cartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    }

    public close(): void {
        this.dialogRef.close();
    }

    public increaseQuantity(item: any): void {
        const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);

        if (index !== -1) {
            this.cartItems[index].quantity += 1;
            this.updateCartInStorage();
        }
    }

    public decreaseQuantity(item: any): void {
        const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);

        if (index !== -1) {
            if (this.cartItems[index].quantity > 1) {
                this.cartItems[index].quantity -= 1;
            } else {
                this.cartItems.splice(index, 1);
            }
            this.updateCartInStorage();
        }
    }

    private updateCartInStorage(): void {
        const updatedCart = this.cartItems.flatMap(item =>
            Array(item.quantity).fill({ id: item.id, name: item.name, price: item.price })
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    public finalizeOrder() {
        console.log(this.cartItems)
        const orderData = {
            customer_id: this.authService.user?.['id'],
            total_amount: this.getTotalPrice(),
            cupcakes: this.cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity
            }))
        };

        this.http.post(this.urlOrder, orderData).subscribe({
            next: () => {
                this.toast.success("Sucesso", "Pedido realizado com sucesso!");
                localStorage.removeItem("cart");
                this.dialogRef.close();
            },
            error: (error) => {
                console.error('Erro ao criar pedido:', error);
            }
        });
    }

}
