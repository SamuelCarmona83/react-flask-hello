const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null || localStorage.getItem("token"),
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			profile: null,
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			login: async (user) => {
				const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
					method: "POST", // *GET, POST, PUT, DELETE, etc.
					headers: {
					  "Content-Type": "application/json",
					},
					body: JSON.stringify(user),
				})
				const data = await resp.json()
				if(resp.ok){
					localStorage.setItem("token", data.access_token)
					setStore({ token: data.access_token })
					return true
				}
				else{
					return false
				}
			},
			getProfile: async (user) => {
				const store = getStore()
				const resp = await fetch(process.env.BACKEND_URL + "/api/protected", {
					method: "GET", // *GET, POST, PUT, DELETE, etc.
					headers: {
					  "Content-Type": "application/json",
					  "Authorization": "Bearer " + store.token
					},
				})
				const data = await resp.json()
				if(resp.ok){
					setStore({ profile: data })
				}
			},
			logout: () => {
				setStore({ profile: null, token: null })
				localStorage.removeItem("token")
			}
		}
	};
};

export default getState;
