import { Hono } from 'hono';
import { and, eq } from 'drizzle-orm';
import { cors } from 'hono/cors';
import { db } from './db';
import { messagesTable } from './db/schema';
import jwt from 'jsonwebtoken';

const app = new Hono();

app.use('*', cors());

app.use('*', async (c, next) => {
  const authorizationToken = c.req.header('Authorization');
  console.log({ authorizationToken });
  if (!authorizationToken) {
    c.status(401);
    return c.body('Authorization header missing');
  }

  const tokens = authorizationToken.split(' ');
  if (tokens.length < 2) {
    c.status(401);
    return c.body('Invalid Authorization header');
  }

  const token = tokens[1];

  const user = jwt.decode(token);
  if (user) {
    user.token = token;
    user.role = user['custom:role'];
    user.userId = user['custom:userId'];
    user.name = user.name || user['custom:name']; // custom:name only exists locally. This is a workaround for cognito-local.
    c.set('user', user);
    await next();
  } else {
    c.status(401);
    return c.body('Invalid JWT Token');
  }
});

app.get('/messages/:type/section/:section', async c => {
  const { section, type } = c.req.param();

  const user = c.get('user') as { userId: string; role: string };
  console.log({ user });

  if (type === 'inbox') {
    const messages = await db.query.messagesTable.findMany({
      where: and(
        eq(messagesTable.toSection, section),
        eq(messagesTable.toUserId, user.userId),
      ),
    });
    return c.json(messages);
  } else if (type === 'outbox') {
    const messages = await db.query.messagesTable.findMany({
      where: and(eq(messagesTable.fromSection, section)),
    });
    return c.json(messages);
  } else if (type === 'completed') {
    const messages = await db.query.messagesTable.findMany({
      where: and(
        eq(messagesTable.toSection, section),
        eq(messagesTable.isCompleted, true),
      ),
    });
    return c.json(messages);
  } else {
    c.status(400);
    return c.text('type must be either inbox, outbox, or completed');
  }
});

export { app };
