import {Component, Inject, Injector, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Customer} from "../../../../models/account/customer";
import {BaseComponent} from "../../../base.component";
import {URLS} from "../../../../app/app.urls";
import {CustomValidators} from "../../../../utilities/validator/custom-validators";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: "app-create-user-dialog",
    templateUrl: "./create-user-dialog.component.html",
    styleUrls: ["./create-user-dialog.component.scss"]
})
export class CreateUserDialogComponent extends BaseComponent<Customer> implements OnInit {

    public object: Customer = new Customer();
    private readonly urlBase: string;
    private readonly urlCustomer: string;

    constructor(public dialogRef: MatDialogRef<CreateUserDialogComponent>, public injector: Injector, @Inject(MAT_DIALOG_DATA) public data: any) {
        super(injector, {endpoint: URLS.CUSTOMER});
        this.urlBase = environment.urlBase;
        this.urlCustomer = `${this.urlBase}${URLS.CUSTOMER}`;
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            name: [null, CustomValidators.required],
            username: [null, CustomValidators.required],
            password: [null, CustomValidators.required],
            email: [null, CustomValidators.email],
            street: [null, CustomValidators.required],
            number: [null, CustomValidators.required],
            neighborhood: [null, CustomValidators.required],
            city: [null, CustomValidators.required],
            zip_code: [null, CustomValidators.required],
        });
    }

    public saveUser(): void {
        if (this.formGroup.valid) {
            const user = this.formGroup.value;
            this.http.post(this.urlCustomer, user).subscribe({
                next: () => {
                    this.toast.success("Sucesso", "Conta criada com sucesso!");
                    this.dialogRef.close(true);
                },
                error: (error) => {
                    console.error('Erro ao criar usuário:', error);
                }
            });
        }
    }

    public close(): void {
        this.dialogRef.close();
    }

}
