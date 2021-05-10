import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./app.scss";

import Header from "./components/header/header";
import SignIn from "./components/sign-in/sign-in";
import Register from "./components/register/register";
import Welcome from "./components/welcome/welcome";

const App = () => {
	return (
		<div className="app">
			<BrowserRouter>
				<Header />
				<Switch>
					<div className="wrapper">
						<Route path="/" exact>
							<Welcome />
						</Route>
						<Route path="/signin">
							<SignIn />
						</Route>
						<Route path="/register">
							<Register />
						</Route>
					</div>
				</Switch>
			</BrowserRouter>
		</div>
	);
};

export default App;
