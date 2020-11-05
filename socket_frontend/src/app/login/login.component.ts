import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from  '../services/user.service'
import * as io from "socket.io-client";
import { environment1 } from './../../environments/environment.prod'
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	reqData
	socket
	constructor(private router: Router, private UserService:UserService) { }

	ngOnInit() {
		this.reqData = {}
		this.socket = io(environment1.socket)
	}
	onLoggedin() {
		var ob = {
			email: this.reqData.email,
			password: this.reqData.password
		}
		this.UserService.UserLogin(ob).subscribe(data => {
			console.log(data)
			if(data.response){
				localStorage.setItem('isLoggedin', 'true');
				localStorage.setItem('UserDetails', JSON.stringify(data));
				localStorage.setItem('token', data.token)
				if(data.data.id){
					this.socket.emit('online',{
							id: data.data.id
						})

				}
				this.router.navigate(['/', 'dashboard']);
			}else{
				alert(data.message)
			}
		}, err => {
			console.log(err);
		})

	}

}
