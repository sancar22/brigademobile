# Brigade Mobile Application

This application is being developed to register all activities involving the Brigade Unit
in Universidad del Norte. This is done for the purpose of solving the current problem the Brigade Unit is facing today: Brigaders are not responding their radios when emergencies occur. This is a serious problem since it puts in jeopardy the lives of many people.

## Meet the current requirements (BOTH WEB AND MOBILE):

### MOBILE REQS

In order to solve this problem, the following is proposed:

Replace current radios with a React Native mobile application with the following requirements:

- Track the Brigader's position in foreground and in background.

- This mobile application will receive notifications from Expo Push Notification service.

- If Brigaders do not attend this notification within 40 seconds, it will be dismissed and this will count as a case rejection, which will be registered in Firebase Real-Time Database.

- If the Brigader opens a notification, it will display important information about the case; for instance, the place, the code, the category and an additional description of the case.

- If the Brigader declines, it will be registered in Firebase and he will be redirected to a Screen where he has to give a reason of rejection, which will also be registered in the DB.

- If the Brigader accepts, it will also be registered and he will be redirected to a Case Screen. In this Screen he will be able to take pictures of the case (not stored in their phones). They will also be able to call the Police, an Ambulance, Firemen and request help from other Brigaders. They are also required to fill a description of what they did to solve the case. On case submission, the data relevant to the case will be stored in the DB.

- Brigaders will be able to see their stats, in a tab inside the application.

### WEB REQS

Through the React Web Application, an administrator will be able to:

- Register all members from the Brigade Unit. All this information will be stored in the real-time DB.

- Create a Case, which will include information such as the place, the category, the code and an additional description of the case the administrator wishes to send a Brigader.

- Select the Brigaders he wants to send the case to in a Map.

- Refresh the current location of every Brigade in a map with a button, no matter if they are in background.

- Visualize all cases (opened and closed).

- Visualize all users' stats.
