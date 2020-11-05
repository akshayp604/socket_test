import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as io from "socket.io-client";
import { environment1 } from './../../../environments/environment.prod'
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    socket
    UserDetails
    constructor(private router: Router) { }

    ngOnInit() {
        this.UserDetails = JSON.parse(localStorage.getItem('UserDetails'))
        this.socket = io(environment1.socket)
    }
   
    onLoggedout() {
        this.socket.emit('offline',{
            id: this.UserDetails.data.id
        })
        localStorage.removeItem('isLoggedin');
        localStorage.removeItem('UserDetails')
        localStorage.removeItem('token')
        this.router.navigateByUrl('/login')
    }

}
