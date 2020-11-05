export const environment = {
  production: true
};

export interface Environment 
{
	endPoint:string;
	socket:string;

}

export const PROD: Environment = {
	endPoint:'http://localhost:3000/',
	socket:'http://localhost:3001',
}

export const environment1: Environment= PROD;