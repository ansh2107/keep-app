import { Component } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import {MatAccordion} from '@angular/material/expansion';


@Component({ templateUrl: 'home.component.html', styleUrls: ['home.component.css']})
export class HomeComponent {
    user: User;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }
}