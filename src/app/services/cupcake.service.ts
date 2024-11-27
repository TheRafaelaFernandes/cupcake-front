import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CupcakeService {
    private refreshListSource = new BehaviorSubject<boolean>(false);
    refreshList$ = this.refreshListSource.asObservable();

    triggerRefreshList() {
        this.refreshListSource.next(true);
    }
}
