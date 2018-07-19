export default function notify(title, body) {
  const notification = new Notification(title, {
    silent: true,
    body
  });
  return notification;
}
