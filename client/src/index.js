import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "./redux/store";

import { CurrentUserProvider } from "./contexts/current-user.context";
import { PostsProvider } from "./contexts/posts.context";

import App from "./app.js";

ReactDOM.render(
	<Provider store={store}>
		<CurrentUserProvider>
			<PostsProvider>
				<App />
			</PostsProvider>
		</CurrentUserProvider>
	</Provider>,
	document.querySelector("#root")
);
