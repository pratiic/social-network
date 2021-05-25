import { combineReducers } from "redux";

import { postsReducer } from "./posts/posts.reducer";
import { profileReducer } from "./profile/profile.reducer";
import { notificationReducer } from "./notification/notification.reducer";
import { userNotificationsReducer } from "./user-notifications/user-notifications.reducer";
import { chatReducer } from "./chat/chat.reducer";
import { navbarReducer } from "./navbar/navbar.reducer";
import { modalReducer } from "./modal/modal.reducer";

export default combineReducers({
	posts: postsReducer,
	profile: profileReducer,
	notification: notificationReducer,
	userNotifications: userNotificationsReducer,
	chat: chatReducer,
	navbar: navbarReducer,
	modal: modalReducer,
});
