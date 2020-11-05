import { Component, OnInit , ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as io from "socket.io-client";
import { environment1 } from './../../../environments/environment.prod'
import { UserService } from  '../../services/user.service'


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	myArray
	form
	reqData
	newArr:any
	socket
	sender
	receiver
	UserDetails
	getMess = {}
	allUserList
	getReceiverId
	recId
	getRoomID
	getChatArray
	uploadImage
	senderName
	constructor(private formBuilder: FormBuilder, private UserService:UserService, private cd: ChangeDetectorRef) {
		this.UserDetails = JSON.parse(localStorage.getItem('UserDetails'))
		console.log(this.UserDetails)
		this.getChatArray = []
		this.socket = io(environment1.socket)
		this.form = this.formBuilder.group({
			'name': [null, Validators.compose([Validators.required, Validators.pattern('^[^ ]+[a-zA-Z ]*')])],
			'email': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')])],
		})
		this.socket.emit('online',{
				id: this.UserDetails.data.id,
		})
		this.allUser()
		
	}

	ngOnInit() {
		this.allUserList = []
		this.form.value.name = ''
		this.form.value.email = ''
		
		this.socket.on('get_messages', (msg: any) => {
			console.log(msg)
			this.getChatArray = msg
			
		});
		this.socket.on('room join', (msg: any) => {
			console.log(msg)
			this.getRoomID = msg.room_id
		});
		this.socket.on('chat message', (msg: any) => {
			console.log(msg)
			this.getChatArray = msg
		});
		this.socket.on('online', (msg: any) => {
			console.log('online status',msg)
		});
		this.cd.markForCheck()

	}
	submit(){

		this.myArray = []
		this.ngOnInit()
	}
	sendMessage(){
		if(this.receiver){

			if(this.getReceiverId){
				this.recId = this.getReceiverId
			}
			else{
	
				this.recId = this.allUserList[0].id
			}
			this.socket.emit('chat message',{
				room_id: this.getRoomID,
				sender_id: this.UserDetails.data.id,
				receiver_id: this.recId,
				message:this.receiver
			})
		}
		this.receiver = ""

		console.log(this.UserDetails.data.id, this.recId, this.getRoomID)

	}
	allUser(){
		this.UserService.UserList().subscribe(data => {
			console.log(data)
			this.allUserList = data.data
			if(data.data && data.data[1]){
				this.recId = data.data[1].id

			}
		}, err => {
			console.log(err);
		})
	}
	gotoId(id, name){
		this.getChatArray = []
		this.senderName = name
		this.socket.emit("get_messages",{
			sender_id: this.UserDetails.data.id,
			receiver_id: id,
		});

		this.cd.detectChanges()
		this.getReceiverId  = id
		this.UserService.findOneUser(id).subscribe(data => {
			console.log(data)
			if(data.chats_rooms){
				for (var i = 0; i < data.chats_rooms.length; i++) {
					if(data.chats_rooms[i].id == this.UserDetails.data.id){
						this.getRoomID = data.chats_rooms[i].room_id
						break;
					}
				}
			}
			this.socket.emit("room join",{
				sender_id: this.UserDetails.data.id,
				receiver_id: id,
				room_id:this.getRoomID
			});
			this.cd.detectChanges()
		}, err => {
			console.log(err);
		})

	}
	onSelectFile(evt:any) { 
		if (!evt.target) {
            return;
        }
        if (!evt.target.files) {
            return;
        }
        if (evt.target.files.length !== 1) {
            return;
        }
        const file = evt.target.files[0];
        console.log(file)
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'application/pdf') {
            return;
        }
        const fr = new FileReader();
        fr.onloadend = (loadEvent) => {
            this.uploadImage = fr.result;
            // console.log(this.uploadImage)

        };
        fr.readAsDataURL(file);
            this.socket.emit('upload_files',{
				room_id: this.getRoomID,
				sender_id: this.UserDetails.data.id,
				receiver_id: this.recId,
				file_name: this.uploadImage,
				image_name:evt.target.files[0]
		})
        
	}

}

