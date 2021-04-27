//import { combineReducers } from 'redux'

const initialState =  {isConnected: false, provider: null, signer: null, contract: null, userAddress: null, numpolls: 0, polls: []};

export default function reducer(state = initialState, action) {
	console.log("reducer", action);
	console.log("state", state);
	console.log("action payload", action.payload);
	if (action.type ===  "SOMETHING") {
		console.log("reducer something");
		return Object.assign({}, state, {
			provider: action.payload.provider,
			signer: action.payload.signer,
			contract: action.payload.contract,
			userAddress: action.payload.userAddress,
		});
	}
	if (action.type === "setnumpolls") {
		console.log("reducer setnumpolls");
		return Object.assign({}, state, {
			numpolls: action.payload.numpolls
		});
	}
	if (action.type === "setpolllist") {
		console.log("reducer setpolllist");
		return Object.assign({}, state, {
			polls: action.payload.polls
		});
	}
	if (action.type === "init") {
		console.log("reducer init");
		return initialState;
	}
	console.log("reducer console log:", state);
	return state;
}
