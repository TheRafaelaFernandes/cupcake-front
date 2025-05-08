import {Component, Inject, Injector, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { BaseComponent } from "src/app/components/base.component";
import { Customer } from "src/app/models/account/customer";
import {URLS} from "../../../../../app/app.urls";
import {environment} from "../../../../../../environments/environment";
import {CustomValidators} from "../../../../../utilities/validator/custom-validators";
import {AuthService} from "../../../../../services/auth.service";


@Component({
    selector: "app-edit-customer-dialog",
    templateUrl: "./edit-customer-dialog.component.html",
    styleUrls: ["./edit-customer-dialog.component.scss"]
})
export class EditCustomerDialogComponent extends BaseComponent<Customer> implements OnInit {

    public object: Customer = new Customer();
    private readonly urlBase: string;
    private readonly urlCustomer: string;

    constructor(public dialogRef: MatDialogRef<EditCustomerDialogComponent>, public authService: AuthService, public injector: Injector, @Inject(MAT_DIALOG_DATA) public data: any) {
        super(injector, {endpoint: URLS.CUSTOMER});
        this.urlBase = environment.urlBase;
        this.urlCustomer = `${this.urlBase}${URLS.CUSTOMER}`;
    }

    public ngOnInit(): void {
        super.ngOnInit(() => {
            this.getCustomer();
        });
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            name: [null, CustomValidators.required],
            password: [null],
            username: [null, CustomValidators.required],
            email: [null, CustomValidators.email],
            street: [null, CustomValidators.required],
            number: [null, CustomValidators.required],
            neighborhood: [null, CustomValidators.required],
            city: [null, CustomValidators.required],
            zip_code: [null, CustomValidators.required],
        });
    }

    public getCustomer(): void {
        this.http.get(`${this.urlCustomer}/${this.authService.user?.['id']}`).subscribe({
            next: (response: Customer) => {
                console.log(response);
                this.formGroup.patchValue({
                    name: response.name,
                    username: response.username,
                    email: response.email,
                    street: response.street,
                    number: response.number,
                    neighborhood: response.neighborhood,
                    city: response.city,
                    zip_code: response.zip_code
                });
            },
            error: (error) => {
                console.error('Erro ao carregar cliente:', error);
            }
        });
    }


    public saveCustomer(): void {
        if (this.formGroup.valid) {
            const customer = this.formGroup.value;
            const customerId = this.authService.user?.['id'];
            if (!customer.password || customer.password.trim() === '') {
                delete customer.password;
            }

            this.http.put(`${this.urlCustomer}/${customerId}`, customer).subscribe({
                next: () => {
                    this.toast.success("Sucesso", "Seus dados foram atualizados com sucesso!");
                    this.dialogRef.close(true);
                },
                error: (error) => {
                    console.error('Erro ao atualizar suas informações:', error);
                    this.toast.error("Erro", "Não foi possível atualizar seus dados. Tente novamente.");
                }
            });
        }
    }

    public close(): void {
        this.dialogRef.close();
    }

}
