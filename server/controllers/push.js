import User from '../models/User';
import { sendResponse } from '../helpers/utils';

const publicKey = (request, response) => {
  response.send(process.env.VAPID_PUBLIC_KEY);
};

const subscribe = async (request, response) => {
  const { subscription } = request.body;
  await User.subscribe({
    subscription: JSON.stringify(subscription),
    userId: request.user.id,
  });
  sendResponse({ response, data: subscription });
};

const notification = async (request, response) => {
  const status = await User.setNotification({
    status: request.body.status,
    userId: request.user.id,
  });
  sendResponse({ response, data: status });
};

export {
  publicKey,
  subscribe,
  notification,
};
