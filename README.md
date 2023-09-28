# Romantismo
An app with the aim of assisting in task organization and completion, featuring a simple interface, daily notifications for daily activities, and collaborative functionality. Users within the same class can share subjects and modify them as needed. Additionally, it serves as a study resource for understanding lifecycle and class components within React Native.

# Technologies
This project was developed using the following technologies:

- [NodeJS](https://nodejs.org/en/)
- [React Native](https://reactnative.dev/)
- [Firebase](https://firebase.google.com/?hl=pt)


# Features
## Sign Up
Registration screen, where users select a class from the available options. A website for creating these classes will also be developed

![alt text](https://media1.giphy.com/media/J1EzZDEbd5JmwD5rRR/giphy.gif)

## Login
Using the email and password already created, the user will be able to log in to the application, gaining access only to the collaborative subjects (lists) of the class to which they belong.

![alt text](https://media3.giphy.com/media/WR3v85llS2QVbzMncA/giphy.gif)

## Interface
After registration, the logged-in user can access a list of tasks related to each registered subject. The interface will display information about the total registered tasks and the total completed tasks for each subject. Above this record, there will be a notification about the next upcoming task, which could be "TASK FOR TODAY," "NEXT TASK FOR: DD/MM/YY," "NO TASKS REGISTERED," or "TASK OVERDUE." Further above, the abbreviated name of the subject/list will be visible. If desired, the user can also apply a filter to display tasks within the lists, sorting them by the area of knowledge (e.g., Humanities, Exact Sciences, Biology, or Technical (IT)). To log out, the user needs to click on their name. Afterward, a confirmation box will appear. If the user clicks "YES," they will be logged out and will need to log in again or create a new account. The password recovery function is still under development.

![alt text](https://media1.giphy.com/media/IhOWhdIqCoxST3Enuw/giphy.gif)

## Activities
Within each subject/list, there will be a list of activities and tasks, where users can view the activity name, its due date, its completion status (indicated by a message below the name and by color), and the option to delete it. To add a new activity to the list, it is necessary to provide both a name and a due date. To save the changes, users must close the list by clicking the "X" or using the "back" button on Android.

![alt text](https://media3.giphy.com/media/JpM8TJaPPTVeQS4ECW/giphy.gif)

## Notifications
The app also supports the sending of notifications. To enable this functionality, all that's required is to access the main interface. Upon doing so, the system will automatically analyze your activities, and depending on the time it was opened, it will schedule notifications. Notifications will be sent every day at 8 AM. For example: if the user opens the app after 8 AM, the system will schedule notifications for the next day for all activities due on that day. If the app is opened before 8 AM, it will schedule notifications for the activities on the same day. To activate this feature, the user needs to open the app daily. Additionally, to receive notifications about new activities published by others, the user will also need to open the app again. With this in mind, it's recommended to open the app at least once during the evening.
