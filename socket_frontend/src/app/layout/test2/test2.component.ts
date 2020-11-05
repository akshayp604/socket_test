import { Component, OnInit } from '@angular/core';
import * as io from "socket.io-client";
import { environment1 } from './../../../environments/environment.prod'
@Component({
	selector: 'app-test2',
	templateUrl: './test2.component.html',
	styleUrls: ['./test2.component.scss']
})
export class Test2Component implements OnInit {
	socket
	getMessage = {}
	sender
	constructor() {
		this.socket = io(environment1.socket)
		this.socket.emit('room join',{
            room_id: '',
            sender_id: '1',
            receiver_id:'3'
        })
		this.socket.on('room join', (msg: any) => {
			console.log(msg)
        });
		console.log("ok")
		this.socket.on('chat message', (msg: any) => {
			this.getMessage = msg
			console.log(msg)
		});
	}

	ngOnInit() {
	}
	sendMessage(){
		console.log(this.sender)
		this.socket.emit('chat message',{
            room_id: '',
            sender_id: '4',
            receiver_id:'1',
            message:this.sender
        })

	}

}
