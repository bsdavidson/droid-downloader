export default function notify(title, body) {
  new Notification(title, {
    silent: true,
    body
  });
}
