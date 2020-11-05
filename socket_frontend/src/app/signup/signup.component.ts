import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from  '../services/user.service'
import { environment1 } from './../../environments/environment.prod'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  reqData
	constructor(private router: Router, private UserService:UserService) { }

  ngOnInit() {
    this.reqData = {}
  }
  signups(){
    if(this.reqData.password != this.reqData.rpassword){
      return
    }
    this.UserService.addUser(this.reqData).subscribe(data => {
      console.log('data added', data)
      this.router.navigateByUrl('/login')
    })
  }

}
