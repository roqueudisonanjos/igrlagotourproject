import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabasexAsync('notifications.db');

export const setupDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        notificationId TEXT,
        title TEXT,
        body TEXT,
        triggerTime INTEGER
      );`
    );
  });
};

export const saveNotification = (notificationId, title, body, triggerTime) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO notifications (notificationId, title, body, triggerTime) VALUES (?, ?, ?, ?);`,
      [notificationId, title, body, triggerTime]
    );
  });
};

export const deleteNotification = (notificationId) => {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM notifications WHERE notificationId = ?;`,
      [notificationId]
    );
  });
};

export const getAllNotifications = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM notifications;`,
      [],
      (_, { rows }) => {
        callback(rows._array);
      }
    );
  });
};
