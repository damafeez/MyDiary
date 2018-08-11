import User from '../models/User';
import { sendResponse } from '../helpers/utils';

const publicKey = (request, response) => {
  response.send(process.env.VAPID_PUBLIC_KEY);
};

const subscribe = async (request, response) => {
  const { subscription, status } = request.body;
  const user = await User.setNotification({
    status,
    subscription: JSON.stringify(subscription),
    userId: request.user.id,
  });
  sendResponse({ response, data: user });
};

export {
  publicKey,
  subscribe,
};
